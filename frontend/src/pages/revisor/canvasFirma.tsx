import { createRef } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { Button } from "../../components";
import { IoArrowUndo, IoArrowRedo } from "react-icons/io5";
import { FaEraser } from "react-icons/fa6";
import { IoIosSave } from "react-icons/io";

export default function CanvasFirma(): React.JSX.Element {
    let drawingCanvas = createRef<ReactSketchCanvasRef>();
    
    const iconsClass = "min-w-5 min-h-5"

    return <div className="min-h-screen h-screen flex flex-col items-center justify-center">
        <ReactSketchCanvas ref={drawingCanvas} className="max-w-60 max-h-60 md:max-w-80 md:max-h-80 drop-shadow-lg mb-10">
        </ReactSketchCanvas>
        <div className="gap-3 grid-cols-3 inline-grid">
            <Button className="gap-5" onClick={() => drawingCanvas.current?.undo()}>
                <IoArrowUndo className={iconsClass} />
                <p>Deshacer</p>
            </Button>
            
            <Button className="gap-5" onClick={() => drawingCanvas.current?.clearCanvas()}>
                <FaEraser className={iconsClass}/>
                <p>Borrar</p>
            </Button>
            

            <Button className="gap-5" onClick={() => drawingCanvas.current?.redo()}>
                <IoArrowRedo className={iconsClass}/>
                <p>Rehacer</p>
            </Button>
            
            <label>
                {/* Hola jeje, esto es para hacer espacio para el grid Atte: Adri*/}
            </label>

            <Button className="gap-5">
                <IoIosSave className={iconsClass}/>
                <p>Guardar</p>
            </Button>
        </div>
    </div>
}