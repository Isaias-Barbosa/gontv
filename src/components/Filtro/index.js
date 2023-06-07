import React from 'react';

export default function Filtro({
  tipos,
  tipoAnimes,
  generos,
  estudios,
  diretores,
  anos,
  temporadas,
  fansubs,
  status,
  filtro,
  onFiltroChange,
}) {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    onFiltroChange({ ...filtro, [name]: value });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label className="block mb-2" htmlFor="tipo">
          Tipo:
        </label>
        <select
          id="tipo"
          name="tipo"
          value={filtro.tipo}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Todos</option>
          {tipos.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        
      </div>

      {/* Renderizar outros selects aqui */}
    </div>
  );
}
