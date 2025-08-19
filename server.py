import http.server
import socketserver
import webbrowser
import os
from threading import Timer

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Agregar headers para CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def log_message(self, format, *args):
        print(f"🌐 {self.address_string()} - {format % args}")

def open_browser():
    """Abre el navegador después de un pequeño retraso"""
    webbrowser.open('http://localhost:8000/test.html')

def start_server():
    PORT = 8000
    
    # Cambiar al directorio actual
    current_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(current_dir)
    
    print("🚀 Iniciando servidor de desarrollo...")
    print(f"📁 Directorio: {current_dir}")
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"✅ Servidor ejecutándose en http://localhost:{PORT}")
        print(f"🧪 Panel de pruebas: http://localhost:{PORT}/test.html")
        print(f"📊 Dashboard: http://localhost:{PORT}/index.html")
        print("\n🔥 Presiona Ctrl+C para detener el servidor")
        
        # Abrir navegador automáticamente después de 1 segundo
        Timer(1.0, open_browser).start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n⏹️ Servidor detenido")

if __name__ == "__main__":
    start_server()
