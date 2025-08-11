# Instalación: pip install TikTokLive
# Esta es una librería no oficial pero muy útil

from TikTokLive import TikTokLiveClient
from TikTokLive.types.events import CommentEvent, ConnectEvent, DisconnectEvent, FollowEvent, ShareEvent, LikeEvent
import asyncio
import json
import websockets
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
import time

class TikTokLiveBot:
    def __init__(self, username):
        self.client = TikTokLiveClient(unique_id=username)
        self.stats = {
            'viewers': 0,
            'likes': 0,
            'follows': 0,
            'shares': 0,
            'comments': [],
            'last_update': time.time()
        }
        
        # Configurar eventos
        self.setup_events()
    
    def setup_events(self):
        @self.client.on("connect")
        async def on_connect(_: ConnectEvent):
            print(f"¡Conectado al live de {self.client.room_info.owner.nickname}!")
            self.stats['viewers'] = self.client.room_info.stats.viewer_count
        
        @self.client.on("comment")
        async def on_comment(event: CommentEvent):
            comment_data = {
                'user': event.user.nickname,
                'comment': event.comment,
                'timestamp': time.time()
            }
            self.stats['comments'].append(comment_data)
            # Mantener solo los últimos 10 comentarios
            if len(self.stats['comments']) > 10:
                self.stats['comments'] = self.stats['comments'][-10:]
            print(f"{event.user.nickname}: {event.comment}")
        
        @self.client.on("follow")
        async def on_follow(event: FollowEvent):
            self.stats['follows'] += 1
            self.stats['last_update'] = time.time()
            print(f"¡{event.user.nickname} te siguió!")
        
        @self.client.on("like")
        async def on_like(event: LikeEvent):
            self.stats['likes'] += event.count
            self.stats['last_update'] = time.time()
            print(f"¡{event.user.nickname} dio {event.count} likes!")
        
        @self.client.on("share")
        async def on_share(event: ShareEvent):
            self.stats['shares'] += 1
            self.stats['last_update'] = time.time()
            print(f"¡{event.user.nickname} compartió el live!")
    
    async def start(self):
        try:
            await self.client.start()
        except Exception as e:
            print(f"Error al conectar: {e}")
    
    def get_stats(self):
        return self.stats

# Servidor HTTP para servir los datos
class StatsHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if hasattr(self.server, 'bot') and self.server.bot:
            stats = self.server.bot.get_stats()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps(stats).encode())
        else:
            self.send_response(503)
            self.end_headers()

def start_server(bot, port=8080):
    server = HTTPServer(('localhost', port), StatsHandler)
    server.bot = bot
    print(f"Servidor iniciado en http://localhost:{port}")
    server.serve_forever()

# Función principal
async def main():
    # Leer configuración
    with open('tiktok_config.json', 'r') as f:
        config = json.load(f)
    
    username = config['tiktok']['username']  # Toma el username del archivo de configuración
    
    bot = TikTokLiveBot(username)
    
    # Iniciar servidor en un hilo separado
    server_thread = threading.Thread(target=start_server, args=(bot,))
    server_thread.daemon = True
    server_thread.start()
    
    # Iniciar el bot
    await bot.start()

if __name__ == "__main__":
    # Ejecutar: python tiktok_live_bot.py
    asyncio.run(main())
