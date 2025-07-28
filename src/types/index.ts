export interface Empresa {
  id: string;
  nombre: string;
  api_key: string;
  id_firebase_uid: string;
}

export interface ClienteFinal {
  id: string;
  nombre: string;
  telefono: string;
  avatar?: string;
}

export interface Conversacion {
  id: string;
  id_empresa: string;
  id_cliente_final: string;
  estado: 'abierta' | 'cerrada' | 'pendiente';
  ia_activa: boolean;
  timestamp_inicio: string;
  timestamp_fin?: string;
  clasificacion_ia?: string;
  resumen_ia?: string;
  cliente?: ClienteFinal;
  ultimo_mensaje?: string;
  ultimo_timestamp?: string;
}

export interface Mensaje {
  id: string;
  id_conversacion: string;
  tipo_remitente: 'bot' | 'agente_humano' | 'cliente_final';
  contenido: string;
  timestamp: string;
  remitente_id?: string;
}

export interface BaseConocimiento {
  id: string;
  id_empresa: string;
  pregunta_clave: string;
  respuesta: string;
  activo: boolean;
  tags?: string[];
}

export interface Reporte {
  id: string;
  id_empresa: string;
  fecha_inicio: string;
  fecha_fin: string;
  total_conversaciones: number;
  conversaciones_clasificadas: {
    venta_cerrada: number;
    cliente_interesado: number;
    requiere_seguimiento: number;
    informacion_solicitada: number;
  };
  tiempo_respuesta_promedio: number;
  satisfaccion_cliente: number;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'agente';
  id_empresa: string;
} 