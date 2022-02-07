import socket
import sys
import json

HOST, PORT = "localhost", 1337

m ={"provider":{"name":"Counter-Strike: Global Offensive","appid":730,"version":13816,"steamid":"76561198353849028","timestamp":1644244122},"player":{"steamid":"76561198353849028","name":"Bre3n","activity":"menu"}}
data = json.dumps(m)

# Create a socket (SOCK_STREAM means a TCP socket)
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    # Connect to server and send data
    sock.connect((HOST, PORT))
    for i in range(10):
        sock.sendall(bytes(data,encoding="utf-8"))


    # Receive data from the server and shut down
    received = sock.recv(1024)
    received = received.decode("utf-8")

finally:
    sock.close()