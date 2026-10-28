import CanvasFirma from "./canvasFirma";
import PreviewDoc from "./previewDoc";

export default function Peticion(): React.JSX.Element {
    return <div className="min-h-screen bg-gris-050 font-sgact">
      <header className="bg-azul-institucional selection:bg-blanco selection:text-azul-institucional">
        <div className='grid-rows-2'>
          <div className="mx-auto flex max-w-4xl items-center gap-5 px-4 py-6 escritorio:gap-6 escritorio:py-8">
            <h1>
                Atendiendo constancia de {"HOLA AQUI CAMBIAR"}
            </h1>
          </div>
          <div className='flex gap-4 justify-center object-center'>
            {/* Regresar a la pantalla anterior boton aca */}
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="min-h-full">
            <PreviewDoc />
        </div>
        <div className="min-h-full">
            <CanvasFirma />
        </div>
      </div>
  </div>
}