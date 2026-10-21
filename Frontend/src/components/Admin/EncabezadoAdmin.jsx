/* Cabecera de cada pantalla del panel: el título grande, una línea que dice qué hay y las acciones de la sección */
function EncabezadoAdmin({ titulo, bajada, children }) {
    return (
        <header className="encabezado-admin">
            <div className="encabezado-admin__texto">
                <h1 className="encabezado-admin__titulo">{titulo}</h1>
                {bajada && <p className="encabezado-admin__bajada">{bajada}</p>}
            </div>
            {children && <div className="encabezado-admin__acciones">{children}</div>}
        </header>
    );
}

export default EncabezadoAdmin;
