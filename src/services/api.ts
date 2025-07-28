import type { Conversacion, Mensaje, BaseConocimiento, Reporte, ClienteFinal } from '../types';

// Mock data
const mockClientes: ClienteFinal[] = [
  { id: '1', nombre: 'Juan Pérez', telefono: '+573001234567' },
  { id: '2', nombre: 'María García', telefono: '+573007654321' },
  { id: '3', nombre: 'Carlos López', telefono: '+573001112223' },
];

const mockConversaciones: Conversacion[] = [
  {
    id: '1',
    id_empresa: 'empresa1',
    id_cliente_final: '1',
    estado: 'abierta',
    ia_activa: true,
    timestamp_inicio: '2024-01-15T10:30:00Z',
    cliente: mockClientes[0],
    ultimo_mensaje: '¿Cuál es el precio del producto?',
    ultimo_timestamp: '2024-01-15T14:20:00Z',
  },
  {
    id: '2',
    id_empresa: 'empresa1',
    id_cliente_final: '2',
    estado: 'cerrada',
    ia_activa: false,
    timestamp_inicio: '2024-01-14T09:15:00Z',
    timestamp_fin: '2024-01-14T16:45:00Z',
    clasificacion_ia: 'Venta Cerrada',
    resumen_ia: 'Cliente interesado en producto premium. Se cerró venta por $500.000',
    cliente: mockClientes[1],
    ultimo_mensaje: 'Perfecto, procedo con la compra',
    ultimo_timestamp: '2024-01-14T16:45:00Z',
  },
  {
    id: '3',
    id_empresa: 'empresa1',
    id_cliente_final: '3',
    estado: 'pendiente',
    ia_activa: true,
    timestamp_inicio: '2024-01-15T08:00:00Z',
    cliente: mockClientes[2],
    ultimo_mensaje: 'Necesito más información sobre garantías',
    ultimo_timestamp: '2024-01-15T12:30:00Z',
  },
];

const mockMensajes: Record<string, Mensaje[]> = {
  '1': [
    {
      id: '1',
      id_conversacion: '1',
      tipo_remitente: 'cliente_final',
      contenido: 'Hola, estoy interesado en sus productos',
      timestamp: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      id_conversacion: '1',
      tipo_remitente: 'bot',
      contenido: '¡Hola! Gracias por contactarnos. ¿En qué producto específico estás interesado?',
      timestamp: '2024-01-15T10:31:00Z',
    },
    {
      id: '3',
      id_conversacion: '1',
      tipo_remitente: 'cliente_final',
      contenido: '¿Cuál es el precio del producto?',
      timestamp: '2024-01-15T14:20:00Z',
    },
  ],
  '2': [
    {
      id: '4',
      id_conversacion: '2',
      tipo_remitente: 'cliente_final',
      contenido: 'Hola, quiero comprar el producto premium',
      timestamp: '2024-01-14T09:15:00Z',
    },
    {
      id: '5',
      id_conversacion: '2',
      tipo_remitente: 'agente_humano',
      contenido: '¡Hola! Te ayudo con la compra del producto premium. El precio es $500.000',
      timestamp: '2024-01-14T09:16:00Z',
      remitente_id: 'agente1',
    },
    {
      id: '6',
      id_conversacion: '2',
      tipo_remitente: 'cliente_final',
      contenido: 'Perfecto, procedo con la compra',
      timestamp: '2024-01-14T16:45:00Z',
    },
  ],
  '3': [
    {
      id: '7',
      id_conversacion: '3',
      tipo_remitente: 'cliente_final',
      contenido: 'Hola, tengo una pregunta sobre garantías',
      timestamp: '2024-01-15T08:00:00Z',
    },
    {
      id: '8',
      id_conversacion: '3',
      tipo_remitente: 'bot',
      contenido: '¡Hola! Con gusto te ayudo con información sobre garantías. ¿Qué producto específico te interesa?',
      timestamp: '2024-01-15T08:01:00Z',
    },
    {
      id: '9',
      id_conversacion: '3',
      tipo_remitente: 'cliente_final',
      contenido: 'Necesito más información sobre garantías',
      timestamp: '2024-01-15T12:30:00Z',
    },
  ],
};

const mockBaseConocimiento: BaseConocimiento[] = [
  {
    id: '1',
    id_empresa: 'empresa1',
    pregunta_clave: 'precio',
    respuesta: 'Nuestros precios varían según el producto. ¿Podrías especificar cuál te interesa?',
    activo: true,
    tags: ['precios', 'productos'],
  },
  {
    id: '2',
    id_empresa: 'empresa1',
    pregunta_clave: 'garantía',
    respuesta: 'Todos nuestros productos tienen garantía de 1 año. Productos premium tienen 2 años.',
    activo: true,
    tags: ['garantía', 'servicio'],
  },
  {
    id: '3',
    id_empresa: 'empresa1',
    pregunta_clave: 'envío',
    respuesta: 'Realizamos envíos a todo el país. El tiempo de entrega es de 3-5 días hábiles.',
    activo: true,
    tags: ['envío', 'logística'],
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Services
export const conversacionesAPI = {
  // Listar conversaciones
  async listarConversaciones(filtros?: { estado?: string; cliente?: string }): Promise<Conversacion[]> {
    await delay(500);
    let conversaciones = [...mockConversaciones];

    if (filtros?.estado) {
      conversaciones = conversaciones.filter(c => c.estado === filtros.estado);
    }

    if (filtros?.cliente) {
      conversaciones = conversaciones.filter(c =>
        c.cliente?.nombre.toLowerCase().includes(filtros.cliente!.toLowerCase())
      );
    }

    return conversaciones;
  },

  // Obtener conversación por ID
  async obtenerConversacion(id: string): Promise<Conversacion | null> {
    await delay(300);
    return mockConversaciones.find(c => c.id === id) || null;
  },

  // Obtener historial de mensajes
  async obtenerHistorialMensajes(idConversacion: string): Promise<Mensaje[]> {
    await delay(400);
    return mockMensajes[idConversacion] || [];
  },

  // Toggle IA ON/OFF
  async toggleIA(idConversacion: string, iaActiva: boolean): Promise<boolean> {
    await delay(200);
    const conversacion = mockConversaciones.find(c => c.id === idConversacion);
    if (conversacion) {
      conversacion.ia_activa = iaActiva;
      return true;
    }
    return false;
  },

  // Enviar mensaje como agente humano
  async enviarMensajeHumano(idConversacion: string, contenido: string): Promise<Mensaje> {
    await delay(300);
    const nuevoMensaje: Mensaje = {
      id: Date.now().toString(),
      id_conversacion: idConversacion,
      tipo_remitente: 'agente_humano',
      contenido,
      timestamp: new Date().toISOString(),
      remitente_id: 'agente1',
    };

    if (!mockMensajes[idConversacion]) {
      mockMensajes[idConversacion] = [];
    }
    mockMensajes[idConversacion].push(nuevoMensaje);

    return nuevoMensaje;
  },
};

export const baseConocimientoAPI = {
  // Listar base de conocimiento
  async listarBaseConocimiento(): Promise<BaseConocimiento[]> {
    await delay(400);
    return [...mockBaseConocimiento];
  },

  // Crear nueva entrada
  async crearEntrada(entrada: Omit<BaseConocimiento, 'id'>): Promise<BaseConocimiento> {
    await delay(500);
    const nuevaEntrada: BaseConocimiento = {
      ...entrada,
      id: Date.now().toString(),
    };
    mockBaseConocimiento.push(nuevaEntrada);
    return nuevaEntrada;
  },

  // Actualizar entrada
  async actualizarEntrada(id: string, entrada: Partial<BaseConocimiento>): Promise<BaseConocimiento | null> {
    await delay(400);
    const index = mockBaseConocimiento.findIndex(e => e.id === id);
    if (index !== -1) {
      mockBaseConocimiento[index] = { ...mockBaseConocimiento[index], ...entrada };
      return mockBaseConocimiento[index];
    }
    return null;
  },

  // Eliminar entrada
  async eliminarEntrada(id: string): Promise<boolean> {
    await delay(300);
    const index = mockBaseConocimiento.findIndex(e => e.id === id);
    if (index !== -1) {
      mockBaseConocimiento.splice(index, 1);
      return true;
    }
    return false;
  },
};

export const reportesAPI = {
  // Obtener reporte de métricas
  async obtenerReporte(fechaInicio: string, fechaFin: string): Promise<Reporte> {
    await delay(600);
    return {
      id: '1',
      id_empresa: 'empresa1',
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      total_conversaciones: 150,
      conversaciones_clasificadas: {
        venta_cerrada: 45,
        cliente_interesado: 30,
        requiere_seguimiento: 25,
        informacion_solicitada: 50,
      },
      tiempo_respuesta_promedio: 2.5,
      satisfaccion_cliente: 4.2,
    };
  },
}; 