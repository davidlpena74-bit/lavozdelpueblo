
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const EXTRA_ARGS = {
    // Política
    "¿Debería ser obligatorio el voto a partir de los 16 años?": {
        pros: ["Coherencia con la edad penal y laboral"],
        cons: ["Posible manipulación ideológica en aulas"]
    },
    "¿Estás a favor de listas abiertas en las elecciones?": {
        pros: ["Rompe la disciplina de voto ciega"],
        cons: ["Riesgo de campañas internas cainitas"]
    },
    "¿Eliminar la inmunidad parlamentaria?": {
        pros: ["Refuerza la confianza ciudadana"],
        cons: ["Judicialización de la política (lawfare)"]
    },
    "¿Debería limitarse el mandato presidencial a 8 años?": {
        pros: ["Reduce el riesgo de corrupción sistémica"],
        cons: ["Perder a líderes muy valorados prematuramente"]
    },
    "¿Financiación exclusivamente pública de partidos?": {
        pros: ["Nivela el tablero de juego electoral"],
        cons: ["Partidización de los presupuestos"]
    },
    "¿Referéndum sobre la forma de Estado (Monarquía/República)?": {
        pros: ["Resolución democrática de una duda histórica"],
        cons: ["Polarización extrema de la sociedad"]
    },

    // Economía
    "¿Implantar la semana laboral de 4 días?": {
        pros: ["Menor huella de carbono por desplazamientos"],
        cons: ["Riesgo de reducción salarial a largo plazo"]
    },
    "¿Regular precios de alquiler por ley?": {
        pros: ["Evita la gentrificación de barrios"],
        cons: ["Deterioro del parque de viviendas existente"]
    },
    "¿Impuesto específico a grandes fortunas?": {
        pros: ["Solidaridad en tiempos de crisis"],
        cons: ["Riesgo de deslocalización fiscal"]
    },
    "¿Uso de criptomonedas como moneda de curso legal?": {
        pros: ["Acceso financiero en zonas no bancarizadas"],
        cons: ["Impacto ambiental de la minería"]
    },
    "¿Subida del Salario Mínimo a 1.500€?": {
        pros: ["Reducción de la brecha de género"],
        cons: ["Posible aumento de la economía sumergida"]
    },
    "¿Impuesto global a las multinacionales tecnológicas?": {
        pros: ["Fin a la ingeniería fiscal agresiva"],
        cons: ["Posible traslado de costes al usuario final"]
    },

    // Social
    "¿Legalización de la gestación subrogada?": {
        pros: ["Regulación garantista frente a la clandestinidad"],
        cons: ["Derecho del menor a conocer su origen"]
    },
    "¿Legalización de la marihuana recreativa?": {
        pros: ["Control de calidad y pureza (Salud Pública)"],
        cons: ["Normalización del consumo en sociedad"]
    },
    "¿Prohibición total de la tauromaquia?": {
        pros: ["Evolución ética de la sociedad"],
        cons: ["Pérdida de biodiversidad (dehesas y toro bravo)"]
    },
    "¿Permisos de paternidad iguales e intransferibles?": {
        pros: ["Elimina el 'impuesto a la maternidad' en contratación"],
        cons: ["Rigidez para familias que prefieren otra organización"]
    },
    "¿Ley de Eutanasia más amplia?": {
        pros: ["Alivio del sufrimiento familiar"],
        cons: ["Presión social sobre ancianos vulnerables"]
    },
    "¿Baja laboral por dolores menstruales incapacitantes?": {
        pros: ["Visibilización de la salud femenina"],
        cons: ["Riesgo de discriminación en la contratación"]
    },

    // Medio Ambiente
    "¿Prohibición de venta de coches diésel/gasolina en 2030?": {
        pros: ["Impulso a la innovación tecnológica industrial"],
        cons: ["Dependencia de minerales críticos extranjeros"]
    },
    "¿Cierre de macro-granjas intensivas?": {
        pros: ["Revitalización de la ganadería extensiva tradicional"],
        cons: ["Encarecimiento de la cesta de la compra básica"]
    },
    "¿Energía Nuclear como \"Verde\"?": {
        pros: ["Independencia energética geopolítica"],
        cons: ["Costes de construcción y desmantelamiento enormes"]
    },
    "¿Impuestos altos al plástico de un solo uso?": {
        pros: ["Cambio cultural hacia lo reutilizable"],
        cons: ["Impacto en sectores de packaging y distribución"]
    },
    "¿Restricciones permanentes de agua en el sur?": {
        pros: ["Garantía de agua de boca para la población"],
        cons: ["Pérdida de tejido agrícola exportador"]
    },
    "¿Prohibición de viajar en jet privado en la UE?": {
        pros: ["Reducción de emisiones de lujo desproporcionadas"],
        cons: ["Impacto marginal en el total global"]
    },

    // Tecnología
    "¿Pausar el desarrollo de IA avanzada?": {
        pros: ["Tiempo para adaptar leyes y regulaciones"],
        cons: ["Imposible de coordinar globalmente (actores rebeldes)"]
    },
    "¿Prohibir TikTok por seguridad nacional?": {
        pros: ["Protección ante algoritmos de influencia extranjera"],
        cons: ["Fragmentación de internet (Splinternet)"]
    },
    "¿Identidad Digital Europea obligatoria?": {
        pros: ["Mayor seguridad en transacciones online"],
        cons: ["Punto único de fallo catastrófico"]
    },
    "¿Prohibir móviles en colegios e institutos?": {
        pros: ["Fomento de la socialización cara a cara"],
        cons: ["Falta de alfabetización digital guiada"]
    },
    "¿Derecho a la desconexión digital estricto?": {
        pros: ["Reducción del síndrome de 'burnout'"],
        cons: ["Dificultad en empresas globales con varios husos"]
    },
    "¿Implantar chip cerebral (Neuralink) en humanos sanos?": {
        pros: ["Cura potencial de parálisis y enfermedades"],
        cons: ["Pérdida de la privacidad mental (Neuroderechos)"]
    },

    // Sanidad
    "¿Incluir psicólogos y dentista en la Seguridad Social?": {
        pros: ["Prevención de problemas mayores a largo plazo"],
        cons: ["Necesidad de subir impuestos para financiarlo"]
    },
    "¿Copago en urgencias no justificadas?": {
        pros: ["Cultura de uso responsable de recursos"],
        cons: ["Barrera para personas con pocos recursos"]
    },
    "¿Vacunación obligatoria para acceder a escuelas?": {
        pros: ["Erradicación efectiva de enfermedades"],
        cons: ["Conflicto con la patria potestad"]
    },
    "¿Gestión privada de hospitales públicos?": {
        pros: ["Innovación y flexibilidad en gestión"],
        cons: ["Riesgo de selección de pacientes rentables"]
    },
    "¿Prohibir venta de bebidas energéticas a menores?": {
        pros: ["Mejora del rendimiento escolar y sueño"],
        cons: ["Infantilización de la juventud"]
    },
    "¿Vacuna contra el cáncer: pública o patente?": {
        pros: ["Derecho humano fundamental a la vida"],
        cons: ["Necesidad de recuperar la inversión privada"]
    },

    // Educación
    "¿Selectividad (EBAU) única para toda España?": {
        pros: ["Ranking universitario más justo"],
        cons: ["Vulneración de competencias autonómicas"]
    },
    "¿Cheque escolar para elegir centro concertado/privado?": {
        pros: ["Empoderamiento de las familias"],
        cons: ["Guetización de la escuela pública restante"]
    },
    "¿Eliminar exámenes de recuperación de junio/septiembre?": {
        pros: ["Fomenta el hábito de estudio diario"],
        cons: ["No tiene en cuenta problemas personales puntuales"]
    },
    "¿Educación financiera obligatoria en secundaria?": {
        pros: ["Ciudadanos más conscientes y difíciles de estafar"],
        cons: ["Enfoque materialista de la educación"]
    },
    "¿Gratuidad total de la Universidad (Grados y Máster)?": {
        pros: ["Ascensor social real"],
        cons: ["Riesgo de estudiantes 'eternos' sin incentivo"]
    },
    "¿Obligatoriedad del uniforme escolar en todos los centros?": {
        pros: ["Elimina la 'marca-manía' y el bullying por ropa"],
        cons: ["Coarta la expresión de la personalidad"]
    },

    // Ciencia
    "¿Inversión del 3% del PIB en Ciencia?": {
        pros: ["Cambio de modelo productivo país"],
        cons: ["Resultados solo visibles a muy largo plazo"]
    },
    "¿Edición genética (CRISPR) en embriones humanos?": {
        pros: ["Eliminación de dolor y sufrimiento hereditario"],
        cons: ["Creación de castas genéticas (The 'Gattaca' effect)"]
    },
    "¿Liberar patentes de vacunas y fármacos vitales?": {
        pros: ["Respuesta rápida a pandemias globales"],
        cons: ["Menor calidad en la producción genérica"]
    },
    "¿Colonización de Marte: prioridad o distracción?": {
        pros: ["Plan B para la supervivencia de la especie"],
        cons: ["Militarización del espacio"]
    },
    "¿Prohibir experimentación animal en cosmética/ciencia?": {
        pros: ["Coherencia con valores animalistas actuales"],
        cons: ["Retraso en biomedicina hasta tener alternativas"]
    },
    "¿Debe España tener su propia agencia espacial potente?": {
        pros: ["Retención de talento ingeniero nacional"],
        cons: ["Burocracia duplicada innecesaria"]
    },

    // Entretenimiento
    "¿Regular estrictamente la publicidad de apuestas?": {
        pros: ["Protección de familias vulnerables"],
        cons: ["Menos patrocinio para deporte base"]
    },
    "¿Cánon digital en móviles y discos duros?": {
        pros: ["Sostenibilidad de la cultura"],
        cons: ["Presunción de culpabilidad"]
    },
    "¿Subtitulado obligatorio vs Doblaje?": {
        pros: ["Mejora del nivel de inglés nacional"],
        cons: ["Barrera para personas mayores o con visión reducida"]
    },
    "¿Limitar precios de reventa de entradas (conciertos)?": {
        pros: ["Cultura accesible, no de lujo"],
        cons: ["Aparición de mercados negros alternativos"]
    },
    "¿Derechos de autor para obras creadas por IA?": {
        pros: ["Incentiva el desarrollo de IA creativa"],
        cons: ["Satura el registro con obras automáticas"]
    },
    "¿Entradas de cine a precio reducido (2€) para mayores?": {
        pros: ["Combate la soledad no deseada"],
        cons: ["Agravio comparativo con jóvenes precarios"]
    }
};

async function updateArguments() {
    console.log("Fetching topics...");
    const { data: topics, error } = await supabase.from('topics').select('*');

    if (error) {
        console.error("Error fetching:", error);
        return;
    }

    let updatedCount = 0;

    for (const topic of topics) {
        const title = topic.title.trim();
        const extras = EXTRA_ARGS[title];

        if (extras) {
            let currentPros = topic.pros || [];
            let currentCons = topic.cons || [];

            // Only add if we have < 3
            if (currentPros.length < 3 || currentCons.length < 3) {
                // Add unique new pros
                extras.pros.forEach(p => {
                    if (!currentPros.includes(p)) currentPros.push(p);
                });
                // Add unique new cons
                extras.cons.forEach(c => {
                    if (!currentCons.includes(c)) currentCons.push(c);
                });

                const { error: updateError } = await supabase
                    .from('topics')
                    .update({ pros: currentPros, cons: currentCons })
                    .eq('id', topic.id);

                if (updateError) {
                    console.error(`Error updating ${title}:`, updateError.message);
                } else {
                    console.log(`✅ Updated: ${title}`);
                    updatedCount++;
                }
            }
        } else {
            console.log(`⚠️ No extras defined for: ${title}`);
        }
    }

    console.log(`Done. Updated ${updatedCount} topics.`);
}

updateArguments();
