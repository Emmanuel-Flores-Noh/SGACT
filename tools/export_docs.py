import os
import argparse
import markdown
import requests
from xhtml2pdf import pisa

def md_to_pdf(md_file, pdf_file):
    """Convierte un archivo Markdown a PDF usando xhtml2pdf."""
    with open(md_file, 'r', encoding='utf-8') as f:
        md_text = f.read()
    
    # Convertir Markdown a HTML
    html_content = markdown.markdown(md_text, extensions=['tables'])
    
    # CSS incrustado
    styled_html = f"""
    <html>
    <head>
        <style>
            @page {{ size: letter portrait; margin: 2cm; }}
            body {{ font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: #333; }}
            h1, h2, h3, h4, h5 {{ color: #1B365D; }}
            table {{ width: 100%; border-collapse: collapse; margin-bottom: 20px; }}
            th, td {{ border: 1px solid #cccccc; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; color: #1B365D; font-weight: bold; }}
            code {{ background-color: #f8f9fa; padding: 2px 4px; border-radius: 4px; font-family: monospace; }}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    # Generar el archivo PDF en la ruta de salida
    with open(pdf_file, "w+b") as result_file:
        pisa_status = pisa.CreatePDF(styled_html, dest=result_file)
        if pisa_status.err:
            print(f"❌ Error convirtiendo el Markdown: {os.path.basename(md_file)}")
        else:
            print(f"✅ PDF generado exitosamente: {os.path.basename(pdf_file)}")

def mermaid_to_svg(mmd_file, pdf_file):
    """Convierte un diagrama Mermaid a PDF consultando la API de Kroki."""
    with open(mmd_file, 'r', encoding='utf-8') as f:
        mermaid_code = f.read()
    
    # Limpiar las etiquetas de markdown si se copiaron por accidente
    mermaid_code = mermaid_code.replace('```mermaid', '').replace('```', '').strip()
    
    url = "https://kroki.io/mermaid/svg"
    # Especificar explícitamente que enviamos texto plano
    headers = {'Content-Type': 'text/plain'} 

    try:
        response = requests.post(url, headers=headers, data=mermaid_code.encode('utf-8'))
        
        if response.status_code == 200:
            with open(pdf_file, 'wb') as f:
                f.write(response.content)
            print(f"✅ SVG generado exitosamente: {os.path.basename(pdf_file)}")
        else:
            print(f"❌ Error al procesar {os.path.basename(mmd_file)} (Status: {response.status_code})")
            print(f"   Detalle del API: {response.text}") # Muestra el motivo exacto del error
    except Exception as e:
         print(f"❌ Error de conexión al generar {os.path.basename(mmd_file)}: {e}")

if __name__ == "__main__":
    # Configuración de los parámetros de terminal
    parser = argparse.ArgumentParser(description="Convierte archivos Markdown y Mermaid a PDF.")
    parser.add_argument("-i", "--input", required=True, help="Ruta de la carpeta de entrada (origen de los .md y .mermaid)")
    parser.add_argument("-o", "--output", required=True, help="Ruta de la carpeta de salida (destino de los .pdf)")
    
    args = parser.parse_args()
    input_dir = args.input
    output_dir = args.output
    
    # Validar que la carpeta de entrada exista
    if not os.path.isdir(input_dir):
        print(f"❌ Error: La carpeta de entrada '{input_dir}' no existe.")
        exit(1)
        
    # Crear la carpeta de salida si no existe
    os.makedirs(output_dir, exist_ok=True)
    
    archivos_procesados = 0
    
    # Iterar sobre los archivos en la carpeta de entrada
    for archivo in os.listdir(input_dir):
        ruta_entrada = os.path.join(input_dir, archivo)
        
        # Ignorar subcarpetas
        if not os.path.isfile(ruta_entrada):
            continue
            
        if archivo.endswith('.md'):
            nombre_salida = archivo.replace('.md', '.pdf')
            ruta_salida = os.path.join(output_dir, nombre_salida)
            
            print(f"Procesando Markdown: {archivo} ...")
            md_to_pdf(ruta_entrada, ruta_salida)
            archivos_procesados += 1
            
        elif archivo.endswith('.mermaid') or archivo.endswith('.mmd'):
            nombre_salida = archivo.rsplit('.', 1)[0] + '.pdf'
            ruta_salida = os.path.join(output_dir, nombre_salida)
            
            print(f"Procesando Mermaid: {archivo} ...")
            mermaid_to_svg(ruta_entrada, ruta_salida)
            archivos_procesados += 1
            
    if archivos_procesados == 0:
        print(f"No se encontraron archivos .md ni .mermaid en '{input_dir}'.")
    else:
        print(f"\n¡Proceso finalizado! Todos los archivos están en '{output_dir}'.")
