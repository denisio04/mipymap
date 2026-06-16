import { SearchView } from '@/components/SearchView';

export default function BuscarPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-lg font-semibold mb-4">Buscar Productos</h1>
      <SearchView />
    </div>
  );
}
