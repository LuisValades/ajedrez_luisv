import type { Lesson } from "./types";

export const LESSONS: Lesson[] = [
  {
    id: "intro",
    title: "¿Qué es el ajedrez?",
    emoji: "🏰",
    subtitle: "El juego del reino",
    badge: "Aventurera del reino",
    closingText: "¡Eres oficialmente una aventurera del reino! Vamos a conocer las piezas.",
    steps: [
      {
        kind: "narrate",
        text: "¡Bienvenida al reino del ajedrez! Aquí dos ejércitos se enfrentan en un tablero mágico.",
        durationMs: 5000,
      },
      {
        kind: "narrate",
        text: "Cada ejército tiene 16 soldados: un Rey, una Reina, dos Torres, dos Alfiles, dos Caballos y ocho Peones.",
        durationMs: 6500,
      },
      {
        kind: "narrate",
        text: "El blanco siempre mueve primero, y se turnan: blanco, negro, blanco, negro.",
        durationMs: 5000,
      },
      {
        kind: "narrate",
        text: "El objetivo es uno solo: atrapar al Rey rival sin que pueda escapar. ¡Eso se llama jaque mate!",
        durationMs: 6000,
      },
      {
        kind: "narrate",
        text: "Cada pieza se mueve diferente. ¡Ahora vamos a conocerlas una por una! Empezamos por el Peón.",
        durationMs: 5500,
      },
    ],
  },
  {
    id: "peon",
    title: "El Peón",
    emoji: "♟️",
    subtitle: "El pequeño escudero",
    requires: ["intro"],
    badge: "Maestra del Peón",
    closingText: "¡Lo lograste! Eres una maestra del Peón. Ahora vamos por la Torre.",
    steps: [
      {
        kind: "narrate",
        text: "El Peón es el más pequeño, pero muy valiente. ¡Tienes ocho!",
        durationMs: 4500,
      },
      {
        kind: "narrate",
        text: "Camina solo hacia adelante, una casilla a la vez. Nunca camina hacia atrás.",
        durationMs: 5000,
      },
      {
        kind: "tap-piece",
        text: "Toca el peón blanco que está enfrente del rey, en la casilla del centro.",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1",
        target: "e2",
      },
      {
        kind: "make-move",
        text: "¡Súper! En su primera jugada, el Peón puede dar dos pasos. Mueve el peón dos casillas para adelante.",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1",
        from: "e2",
        to: ["e4"],
        pista: "Toca el peón en e2 y luego la casilla e4.",
      },
      {
        kind: "narrate",
        text: "Después de su primera vez, ya solo da un paso a la vez.",
        durationMs: 4500,
      },
      {
        kind: "narrate",
        text: "El Peón come diferente: en diagonal, una casilla. Mira esto.",
        durationMs: 4500,
      },
      {
        kind: "make-move",
        text: "Hay un peón negro en d5. Cómelo con tu peón en e4 — moviendo en diagonal.",
        fen: "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w - - 0 2",
        from: "e4",
        to: ["d5"],
        pista: "Toca el peón blanco en e4 y luego el peón negro en d5.",
      },
      {
        kind: "narrate",
        text: "¡Bien hecho! Cuando un Peón llega hasta la fila 8, se transforma en Reina. ¡Es magia!",
        durationMs: 5500,
      },
    ],
  },
  {
    id: "torre",
    title: "La Torre",
    emoji: "🏰",
    subtitle: "El castillo guerrero",
    requires: ["peon"],
    badge: "Maestra de la Torre",
    closingText: "¡Ya dominas la Torre! Sigue el Alfil.",
    steps: [
      {
        kind: "narrate",
        text: "La Torre es como un castillo. Camina en líneas rectas: arriba, abajo, izquierda o derecha.",
        durationMs: 5500,
      },
      {
        kind: "narrate",
        text: "Puede moverse muchas casillas a la vez, pero no puede saltar piezas.",
        durationMs: 5000,
      },
      {
        kind: "tap-piece",
        text: "Toca la Torre blanca en el centro del tablero.",
        fen: "8/8/8/8/3R4/8/8/4K2k w - - 0 1",
        target: "d4",
      },
      {
        kind: "make-move",
        text: "Mueve la Torre hasta la columna h, en la fila 4. Atraviesa todo el tablero en horizontal.",
        fen: "8/8/8/8/3R4/8/8/4K2k w - - 0 1",
        from: "d4",
        to: ["h4"],
        pista: "Toca la Torre y luego la casilla h4 (extremo derecho de la fila 4).",
      },
      {
        kind: "narrate",
        text: "¡Impecable! Ahora prueba mover la Torre hacia arriba.",
        durationMs: 4000,
      },
      {
        kind: "make-move",
        text: "Mueve la Torre desde h4 hasta h7, subiendo tres casillas.",
        fen: "8/8/8/8/7R/8/8/4K2k w - - 0 2",
        from: "h4",
        to: ["h7"],
        pista: "Toca la Torre y luego h7 (tres casillas arriba).",
      },
      {
        kind: "narrate",
        text: "Las dos Torres juntas son muy poderosas. ¡Cuídalas bien!",
        durationMs: 4500,
      },
    ],
  },
  {
    id: "alfil",
    title: "El Alfil",
    emoji: "🧙",
    subtitle: "El mago del tablero",
    requires: ["torre"],
    badge: "Maestra del Alfil",
    closingText: "¡Brujería pura! Ahora la Reina, la pieza más fuerte.",
    steps: [
      {
        kind: "narrate",
        text: "El Alfil es un mago. ¡Solo se mueve en diagonal!",
        durationMs: 4500,
      },
      {
        kind: "narrate",
        text: "Cada Alfil camina siempre del mismo color de casilla: uno por las claras y otro por las oscuras.",
        durationMs: 5500,
      },
      {
        kind: "tap-piece",
        text: "Toca el Alfil blanco que está en el centro.",
        fen: "8/8/8/8/3B4/8/8/4K2k w - - 0 1",
        target: "d4",
      },
      {
        kind: "make-move",
        text: "Mueve el Alfil hasta h8 — esquina arriba a la derecha — caminando en diagonal.",
        fen: "8/8/8/8/3B4/8/8/4K2k w - - 0 1",
        from: "d4",
        to: ["h8"],
        pista: "Toca el Alfil y luego la esquina arriba derecha (h8). Va en diagonal.",
      },
      {
        kind: "narrate",
        text: "¡Magia diagonal! Igual que la Torre, no puede saltar piezas.",
        durationMs: 4500,
      },
      {
        kind: "make-move",
        text: "Ahora mueve el Alfil de regreso, en diagonal hasta a1.",
        fen: "7B/8/8/8/8/8/8/4K2k w - - 0 2",
        from: "h8",
        to: ["a1"],
        pista: "Toca el Alfil y luego la esquina abajo izquierda (a1).",
      },
      {
        kind: "narrate",
        text: "Cuando juntas tus dos alfiles, son una pareja peligrosa para el rival.",
        durationMs: 4500,
      },
    ],
  },
  {
    id: "reina",
    title: "La Reina",
    emoji: "👑",
    subtitle: "La pieza más poderosa",
    requires: ["alfil"],
    badge: "Maestra de la Reina",
    closingText: "¡La Reina obedece! Ahora viene el Rey, el más importante.",
    steps: [
      {
        kind: "narrate",
        text: "La Reina es la pieza más fuerte. ¡Combina los movimientos de la Torre y el Alfil!",
        durationMs: 5500,
      },
      {
        kind: "narrate",
        text: "Se mueve en línea recta, en diagonal, todo lo que quiera. Solo no puede saltar piezas.",
        durationMs: 5500,
      },
      {
        kind: "tap-piece",
        text: "Toca la Reina blanca.",
        fen: "8/8/8/8/3Q4/8/8/4K2k w - - 0 1",
        target: "d4",
      },
      {
        kind: "make-move",
        text: "Mueve la Reina en diagonal hasta a7.",
        fen: "8/8/8/8/3Q4/8/8/4K2k w - - 0 1",
        from: "d4",
        to: ["a7"],
        pista: "Toca la Reina y luego a7. Es una diagonal larga.",
      },
      {
        kind: "make-move",
        text: "Ahora muévela en línea recta hasta a1.",
        fen: "8/Q7/8/8/8/8/8/4K2k w - - 0 2",
        from: "a7",
        to: ["a1"],
        pista: "Toca la Reina y luego a1, baja por la columna a.",
      },
      {
        kind: "narrate",
        text: "Cuídala mucho: si pierdes a tu Reina, será mucho más difícil ganar.",
        durationMs: 4500,
      },
    ],
  },
  {
    id: "rey",
    title: "El Rey",
    emoji: "🤴",
    subtitle: "La pieza más importante",
    requires: ["reina"],
    badge: "Maestra del Rey",
    closingText: "¡Protegerás al Rey siempre! Ahora el último: el Caballo, el más raro.",
    steps: [
      {
        kind: "narrate",
        text: "El Rey es la pieza más importante. Si lo atrapan sin escape, es jaque mate y se acaba el juego.",
        durationMs: 6000,
      },
      {
        kind: "narrate",
        text: "Pero camina poquito: solo una casilla a la vez, en cualquier dirección.",
        durationMs: 5000,
      },
      {
        kind: "tap-piece",
        text: "Toca el Rey blanco en el centro.",
        fen: "8/8/8/8/3K4/8/8/7k w - - 0 1",
        target: "d4",
      },
      {
        kind: "make-move",
        text: "Mueve el Rey una casilla a la derecha (e4).",
        fen: "8/8/8/8/3K4/8/8/7k w - - 0 1",
        from: "d4",
        to: ["e4", "e5", "d5", "c5", "c4", "c3", "d3", "e3"],
        pista: "Toca el Rey y luego cualquier casilla pegadita.",
      },
      {
        kind: "narrate",
        text: "El Rey nunca puede ir a una casilla atacada. ¡Eso sería peligroso!",
        durationMs: 4500,
      },
      {
        kind: "narrate",
        text: "Cuando el Rey está siendo amenazado, se llama jaque. ¡Hay que sacarlo del peligro de inmediato!",
        durationMs: 5500,
      },
    ],
  },
  {
    id: "caballo",
    title: "El Caballo",
    emoji: "🐴",
    subtitle: "El saltarín especial",
    requires: ["rey"],
    badge: "Maestra del Caballo",
    closingText: "¡Felicidades! Conoces todas las piezas. ¡Ya eres una verdadera maestra del reino!",
    steps: [
      {
        kind: "narrate",
        text: "El Caballo es la pieza más rara, ¡y la única que puede saltar piezas!",
        durationMs: 5000,
      },
      {
        kind: "narrate",
        text: "Se mueve en forma de L: dos casillas en una dirección y una a un lado.",
        durationMs: 5500,
      },
      {
        kind: "narrate",
        text: "Imagina que la L se puede girar para todos lados. Tiene hasta 8 movimientos posibles.",
        durationMs: 5500,
      },
      {
        kind: "tap-piece",
        text: "Toca el Caballo blanco en el centro.",
        fen: "8/8/8/8/3N4/8/8/4K2k w - - 0 1",
        target: "d4",
      },
      {
        kind: "make-move",
        text: "Mueve el Caballo a una de las 8 casillas marcadas. Cualquier movimiento de L vale.",
        fen: "8/8/8/8/3N4/8/8/4K2k w - - 0 1",
        from: "d4",
        to: ["e6", "f5", "f3", "e2", "c2", "b3", "b5", "c6"],
        pista: "Cualquiera de los puntitos azules vale. ¡Salta donde quieras!",
      },
      {
        kind: "narrate",
        text: "¡Eso es! El Caballo puede saltar sobre tus piezas y las del rival.",
        durationMs: 4500,
      },
      {
        kind: "narrate",
        text: "Si quieres dar jaque desde lejos, el Caballo es perfecto: pocas piezas pueden detenerlo.",
        durationMs: 5000,
      },
    ],
  },
];

export function getLesson(id: string) {
  return LESSONS.find((l) => l.id === id);
}

export function isLessonUnlocked(
  lesson: { requires?: string[] },
  completed: string[],
): boolean {
  if (!lesson.requires || lesson.requires.length === 0) return true;
  return lesson.requires.every((r) => completed.includes(r));
}
