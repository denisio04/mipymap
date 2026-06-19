const MAX_DIM = 1200;

export async function fixImageOrientation(file: File): Promise<File> {
  const result = await tryResizeBitmap(file);
  if (result) return result;
  return fixOrientationManual(file);
}

async function tryResizeBitmap(file: File): Promise<File | null> {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
      premultiplyAlpha: "none",
      resizeWidth: MAX_DIM,
      resizeHeight: MAX_DIM,
      resizeQuality: "high",
    });

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (blob) return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
  } catch {
    // fallback
  }
  return null;
}

async function fixOrientationManual(file: File): Promise<File> {
  try {
    const orientation = await readExifOrientation(file);

    if (orientation <= 1) {
      const resized = await tryResizeFile(file);
      if (resized) return resized;
      return file;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        if (orientation >= 5) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        switch (orientation) {
          case 2: ctx.transform(-1, 0, 0, 1, img.width, 0); break;
          case 3: ctx.transform(-1, 0, 0, -1, img.width, img.height); break;
          case 4: ctx.transform(1, 0, 0, -1, 0, img.height); break;
          case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
          case 6: ctx.transform(0, 1, -1, 0, img.height, 0); break;
          case 7: ctx.transform(0, -1, -1, 0, img.height, img.width); break;
          case 8: ctx.transform(0, -1, 1, 0, 0, img.width); break;
        }

        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(img.src);

        const blob = await resizeAndBlob(canvas, 0.85);
        if (blob) {
          resolve(new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
        } else {
          resolve(file);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve(file);
      };
      img.src = URL.createObjectURL(file);
    });
  } catch {
    return file;
  }
}

async function tryResizeFile(file: File): Promise<File | null> {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
      premultiplyAlpha: "none",
      resizeWidth: MAX_DIM,
      resizeHeight: MAX_DIM,
      resizeQuality: "high",
    });

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (blob) return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
  } catch {
    // fallback
  }
  return null;
}

function resizeAndBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob | null> {
  let w = canvas.width;
  let h = canvas.height;

  if (w > MAX_DIM || h > MAX_DIM) {
    const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);

    const resized = document.createElement("canvas");
    resized.width = w;
    resized.height = h;
    const ctx = resized.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(canvas, 0, 0, w, h);
    return new Promise((resolve) => resized.toBlob(resolve, "image/jpeg", quality));
  }

  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

async function readExifOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const view = new DataView(reader.result as ArrayBuffer);
        if (view.getUint16(0, false) !== 0xffd8) {
          resolve(1);
          return;
        }

        let offset = 2;
        while (offset < view.byteLength) {
          const marker = view.getUint16(offset, false);
          if (marker === 0xffe1) {
            const exifOffset = offset + 4 + view.getUint16(offset + 2, false);
            if (exifOffset + 8 > view.byteLength) break;

            const header = String.fromCharCode(
              view.getUint8(exifOffset), view.getUint8(exifOffset + 1),
              view.getUint8(exifOffset + 2), view.getUint8(exifOffset + 3),
              view.getUint8(exifOffset + 4), view.getUint8(exifOffset + 5),
            );
            if (header !== "Exif\0\0") break;

            const tiffOffset = exifOffset + 6;
            const littleEndian = view.getUint16(tiffOffset, false) === 0x4949;
            const ifdOffset = tiffOffset + view.getUint32(tiffOffset + 4, littleEndian);

            const entries = view.getUint16(ifdOffset, littleEndian);
            for (let i = 0; i < entries; i++) {
              const entry = ifdOffset + 2 + i * 12;
              if (view.getUint16(entry, littleEndian) === 0x0112) {
                const orientation = view.getUint16(entry + 8, littleEndian);
                resolve(orientation >= 1 && orientation <= 8 ? orientation : 1);
                return;
              }
            }
          }
          const size = view.getUint16(offset + 2, false);
          if (size < 2) break;
          offset += 2 + size;
        }
      } catch {
        // ignore
      }
      resolve(1);
    };
    reader.onerror = () => resolve(1);
    reader.readAsArrayBuffer(file.slice(0, 65536));
  });
}
