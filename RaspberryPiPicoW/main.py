from machine import Pin, ADC
import network
import urequests
import utime
import time

ssid = 'NETWORK_NAME'
password = 'PASSWORD'
API_BASE = 'http://IP_ADDRESS:5000'

ldr_adc = ADC(26)
pir = Pin(16, Pin.IN)
rele = Pin(15, Pin.OUT)

light_on = False
last_motion_time = 0
LDR_THRESHOLD = 10000
MOTION_TIMEOUT = 10

config = {
    "modo": "auto",
    "usar_pir": True,
    "usar_ldr": True,
    "usar_horario": False,
    "horario_inicio": "18:00",
    "horario_fim": "06:00"
}
last_config_check = 0
CONFIG_INTERVAL = 10


def conectar_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)

    start = utime.time()
    while not wlan.isconnected():
        if utime.time() - start > 10:
            print("Falha ao conectar ao Wi-Fi")
            return False
        utime.sleep(1)

    print("Wi-Fi conectado! IP:", wlan.ifconfig()[0])
    return True


def get_config():
    global config
    try:
        res = urequests.get(f"{API_BASE}/config")
        if res.status_code == 200:
            config = res.json()
            print("Nova configuração:", config)
        res.close()
    except Exception as e:
        print("Erro ao buscar config:", e)


def enviar_evento(evento):
    try:
        res = urequests.post(f"{API_BASE}/event", json={
            "event": evento,
            "source": "pico"
        })
        res.close()
    except Exception as e:
        print("Erro ao enviar evento:", e)


def dentro_do_horario(inicio_str, fim_str):
    try:
        agora = time.localtime()
        agora_min = agora[3] * 60 + agora[4]
        h_i, m_i = [int(x) for x in inicio_str.split(":")]
        h_f, m_f = [int(x) for x in fim_str.split(":")]
        ini_min = h_i * 60 + m_i
        fim_min = h_f * 60 + m_f

        if ini_min <= fim_min:
            return ini_min <= agora_min <= fim_min
        else:
            return agora_min >= ini_min or agora_min <= fim_min
    except:
        return True
        
rele.value(1)
conectado = conectar_wifi()

print("Sistema iniciado.")
get_config()

while True:
    current_time = utime.time()

    if current_time - last_config_check > CONFIG_INTERVAL:
        get_config()
        last_config_check = current_time

    ldr_value = ldr_adc.read_u16()
    motion_detected = pir.value()
    horario_ok = dentro_do_horario(config["horario_inicio"], config["horario_fim"])

    print("LDR:", ldr_value, "| Movimento:", motion_detected, "| Tempo sem movimento:", current_time - last_motion_time)

    if config["modo"] == "manual_on" and (not config.get("usar_horario") or horario_ok):
        if not light_on:
            print("Modo manual ON → Ligando luz")
            rele.value(0)
            light_on = True
            enviar_evento("ligada_manual")

    elif config["modo"] == "manual_off" or (config.get("usar_horario") and not horario_ok):
        if light_on:
            print("Modo manual OFF ou fora de horário → Desligando luz")
            rele.value(1)
            light_on = False
            enviar_evento("desligada_manual")

    elif config["modo"] == "auto":
        usar_pir = config.get("usar_pir", True)
        usar_ldr = config.get("usar_ldr", True)

        if usar_pir and motion_detected:
            last_motion_time = current_time
            print("Movimento detectado")

        deve_ligar = False
        if usar_pir and motion_detected:
            if not usar_ldr or ldr_value < LDR_THRESHOLD:
                deve_ligar = True
        elif not usar_pir and usar_ldr and ldr_value < LDR_THRESHOLD:
            deve_ligar = True

        if deve_ligar and not light_on:
            print("Condições para ligar → Ligando luz")
            rele.value(0)
            light_on = True
            enviar_evento("ligada_auto")

        # Desligar luz
        deve_desligar = False
        if usar_pir and (current_time - last_motion_time >= MOTION_TIMEOUT):
            deve_desligar = True
            print("Sem movimento suficiente")
        if usar_ldr and ldr_value > LDR_THRESHOLD:
            deve_desligar = True
            print("Ambiente claro")

        if (usar_pir or usar_ldr) and light_on and deve_desligar:
            print("Condições para desligar → Desligando luz")
            rele.value(1)
            light_on = False
            enviar_evento("desligada_auto")

    utime.sleep(0.5)
