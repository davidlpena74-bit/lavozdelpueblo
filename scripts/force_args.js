
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YnZlZ254bXl2cG9sdm9ma2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUzODU1NSwiZXhwIjoyMDgzMTE0NTU1fQ.LZY5yd8l4nT2O9GLVHQiPNF7HcJPXi7ZPH18Dp9h2Hc';
const supabase = createClient(process.env.VITE_SUPABASE_URL, SERVICE_KEY);

const FULL_ARGS = {
    // Política
    "¿Debería ser obligatorio el voto a partir de los 16 años?": {
        pros: ["Fomenta la participación joven", "Representación intergeneracional", "Coherencia con la edad penal y laboral"],
        cons: ["Falta de madurez política", "Influencia familiar excesiva", "Posible manipulación ideológica en aulas"]
    },
    "¿Estás a favor de listas abiertas en las elecciones?": {
        pros: ["Mayor conexión elector-representante", "Reduce el poder de las cúpulas", "Rompe la disciplina de voto ciega"],
        cons: ["Complejidad del recuento", "Riesgo de clientelismo", "Riesgo de campañas internas cainitas"]
    },
    "¿Eliminar la inmunidad parlamentaria?": {
        pros: ["Igualdad ante la ley", "Menos impunidad", "Refuerza la confianza ciudadana"],
        cons: ["Riesgo de persecución política", "Desprotección de la oposición", "Judicialización de la política (lawfare)"]
    },
    "¿Debería limitarse el mandato presidencial a 8 años?": {
        pros: ["Evita el caudillismo", "Renovación política", "Reduce el riesgo de corrupción sistémica"],
        cons: ["Pérdida de experiencia", "Interrupción de proyectos largos", "Perder a líderes muy valorados prematuramente"]
    },
    "¿Financiación exclusivamente pública de partidos?": {
        pros: ["Menor corrupción", "Independencia de lobbies", "Nivela el tablero de juego electoral"],
        cons: ["Mayor gasto estatal", "Partidos dependientes del gobierno", "Partidización de los presupuestos"]
    },
    "¿Referéndum sobre la forma de Estado (Monarquía/República)?": {
        pros: ["Soberanía popular", "Modernización", "Resolución democrática de una duda histórica"],
        cons: ["Desestabilización", "Tradición", "Polarización extrema de la sociedad"]
    },

    // Economía
    "¿Implantar la semana laboral de 4 días?": {
        pros: ["Mejor conciliación", "Aumento de productividad", "Menor huella de carbono por desplazamientos"],
        cons: ["Costes para PYMES", "Difícil en sector servicios", "Riesgo de reducción salarial a largo plazo"]
    },
    "¿Regular precios de alquiler por ley?": {
        pros: ["Acceso a vivienda digna", "Freno a la especulación", "Evita la gentrificación de barrios"],
        cons: ["Reducción de oferta", "Mercado negro", "Deterioro del parque de viviendas existente"]
    },
    "¿Impuesto específico a grandes fortunas?": {
        pros: ["Redistribución de riqueza", "Justicia fiscal", "Solidaridad en tiempos de crisis"],
        cons: ["Fuga de capitales", "Doble imposición", "Riesgo de deslocalización fiscal"]
    },
    "¿Uso de criptomonedas como moneda de curso legal?": {
        pros: ["Innovación financiera", "Independencia bancaria", "Acceso financiero en zonas no bancarizadas"],
        cons: ["Volatilidad extrema", "Riesgo de blanqueo", "Impacto ambiental de la minería"]
    },
    "¿Subida del Salario Mínimo a 1.500€?": {
        pros: ["Dignidad laboral", "Reactiva consumo interno", "Reducción de la brecha de género"],
        cons: ["Pérdida de empleo", "Inflación de costes", "Posible aumento de la economía sumergida"]
    },
    "¿Impuesto global a las multinacionales tecnológicas?": {
        pros: ["Justicia fiscal", "Ingresos públicos", "Fin a la ingeniería fiscal agresiva"],
        cons: ["Fuga de inversión", "Repercusión precios", "Posible traslado de costes al usuario final"]
    },

    // Social
    "¿Legalización de la gestación subrogada?": {
        pros: ["Derecho a formar familia", "Libertad individual", "Regulación garantista frente a la clandestinidad"],
        cons: ["Mercantilización del cuerpo", "Explotación de mujeres pobres", "Derecho del menor a conocer su origen"]
    },
    "¿Legalización de la marihuana recreativa?": {
        pros: ["Impuestos para el estado", "Fin de mafias", "Control de calidad y pureza (Salud Pública)"],
        cons: ["Riesgos salud pública", "Adicción en jóvenes", "Normalización del consumo en sociedad"]
    },
    "¿Prohibición total de la tauromaquia?": {
        pros: ["Derechos animales", "Fin de la tortura", "Evolución ética de la sociedad"],
        cons: ["Tradición cultural", "Impacto económico ganadero", "Pérdida de biodiversidad (dehesas y toro bravo)"]
    },
    "¿Permisos de paternidad iguales e intransferibles?": {
        pros: ["Igualdad laboral", "Corresponsabilidad", "Elimina el 'impuesto a la maternidad' en contratación"],
        cons: ["Menor libertad de organización", "Coste empresarial", "Rigidez para familias que prefieren otra organización"]
    },
    "¿Ley de Eutanasia más amplia?": {
        pros: ["Muerte digna", "Autonomía del paciente", "Alivio del sufrimiento familiar"],
        cons: ["Pendiente resbaladiza", "Ética médica", "Presión social sobre ancianos vulnerables"]
    },
    "¿Baja laboral por dolores menstruales incapacitantes?": {
        pros: ["Derechos mujer", "Salud real", "Visibilización de la salud femenina"],
        cons: ["Estigmatización", "Contratación", "Riesgo de discriminación en la contratación"]
    },

    // Medio Ambiente
    "¿Prohibición de venta de coches diésel/gasolina en 2030?": {
        pros: ["Reducción emisiones", "Aire más limpio", "Impulso a la innovación tecnológica industrial"],
        cons: ["Precio coches eléctricos", "Infraestructura insuficiente", "Dependencia de minerales críticos extranjeros"]
    },
    "¿Cierre de macro-granjas intensivas?": {
        pros: ["Menos contaminación nitratos", "Bienestar animal", "Revitalización de la ganadería extensiva tradicional"],
        cons: ["Carne más cara", "Pérdida empleo rural", "Encarecimiento de la cesta de la compra básica"]
    },
    "¿Energía Nuclear como \"Verde\"?": {
        pros: ["Sin emisiones CO2", "Energía base estable", "Independencia energética geopolítica"],
        cons: ["Residuos radiactivos", "Riesgo accidentes", "Costes de construcción y desmantelamiento enormes"]
    },
    "¿Impuestos altos al plástico de un solo uso?": {
        pros: ["Reduce residuos", "Fomenta reutilización", "Cambio cultural hacia lo reutilizable"],
        cons: ["Coste cesta compra", "Adaptación industrial", "Impacto en sectores de packaging y distribución"]
    },
    "¿Restricciones permanentes de agua en el sur?": {
        pros: ["Sostenibilidad real", "Proteger ecosistemas", "Garantía de agua de boca para la población"],
        cons: ["Fin agricultura intensiva", "Despoblación", "Pérdida de tejido agrícola exportador"]
    },
    "¿Prohibición de viajar en jet privado en la UE?": {
        pros: ["Justicia climática", "Emisiones", "Reducción de emisiones de lujo desproporcionadas"],
        cons: ["Libertad movimiento", "Negocios", "Impacto marginal en el total global"]
    },

    // Tecnología
    "¿Pausar el desarrollo de IA avanzada?": {
        pros: ["Seguridad y control", "Evaluación ética", "Tiempo para adaptar leyes y regulaciones"],
        cons: ["Freno a la innovación", "Ventaja para China/Rusia", "Imposible de coordinar globalmente (actores rebeldes)"]
    },
    "¿Prohibir TikTok por seguridad nacional?": {
        pros: ["Protección de datos", "Soberanía digital", "Protección ante algoritmos de influencia extranjera"],
        cons: ["Censura", "Libertad de expresión", "Fragmentación de internet (Splinternet)"]
    },
    "¿Identidad Digital Europea obligatoria?": {
        pros: ["Comodidad", "Burocracia ágil", "Mayor seguridad en transacciones online"],
        cons: ["Riesgo hackeo masivo", "Vigilancia estatal", "Punto único de fallo catastrófico"]
    },
    "¿Prohibir móviles en colegios e institutos?": {
        pros: ["Mejora atención", "Menos ciberbullying", "Fomento de la socialización cara a cara"],
        cons: ["Herramienta educativa", "Control parental", "Falta de alfabetización digital guiada"]
    },
    "¿Derecho a la desconexión digital estricto?": {
        pros: ["Salud mental", "Respeto al descanso", "Reducción del síndrome de 'burnout'"],
        cons: ["Rigidez laboral", "Problemas en urgencias", "Dificultad en empresas globales con varios husos"]
    },
    "¿Implantar chip cerebral (Neuralink) en humanos sanos?": {
        pros: ["Superar limitaciones", "Competir con IA", "Cura potencial de parálisis y enfermedades"],
        cons: ["Hackeo cerebral", "Desigualdad", "Pérdida de la privacidad mental (Neuroderechos)"]
    },

    // Sanidad
    "¿Incluir psicólogos y dentista en la Seguridad Social?": {
        pros: ["Salud integral", "Equidad social", "Prevención de problemas mayores a largo plazo"],
        cons: ["Alto coste fiscal", "Colapso de listas espera", "Necesidad de subir impuestos para financiarlo"]
    },
    "¿Copago en urgencias no justificadas?": {
        pros: ["Disuade abuso", "Mejor atención real", "Cultura de uso responsable de recursos"],
        cons: ["Penaliza a pobres", "Riesgo diagnóstico", "Barrera para personas con pocos recursos"]
    },
    "¿Vacunación obligatoria para acceder a escuelas?": {
        pros: ["Inmunidad de rebaño", "Protección menores", "Erradicación efectiva de enfermedades"],
        cons: ["Libertad individual", "Derecho educación", "Conflicto con la patria potestad"]
    },
    "¿Gestión privada de hospitales públicos?": {
        pros: ["Eficiencia gestión", "Menor coste", "Innovación y flexibilidad en gestión"],
        cons: ["Peor calidad servicio", "Precarización laboral", "Riesgo de selección de pacientes rentables"]
    },
    "¿Prohibir venta de bebidas energéticas a menores?": {
        pros: ["Salud cardiovascular", "Menos obesidad", "Mejora del rendimiento escolar y sueño"],
        cons: ["Exceso regulación", "Daño industria", "Infantilización de la juventud"]
    },
    "¿Vacuna contra el cáncer: pública o patente?": {
        pros: ["Acceso universal", "Bien común", "Derecho humano fundamental a la vida"],
        cons: ["Incentivo inversión", "Propiedad", "Necesidad de recuperar la inversión privada"]
    },

    // Educación
    "¿Selectividad (EBAU) única para toda España?": {
        pros: ["Igualdad oportunidades", "Justicia acceso", "Ranking universitario más justo"],
        cons: ["Centralización", "Diferencias currículo", "Vulneración de competencias autonómicas"]
    },
    "¿Cheque escolar para elegir centro concertado/privado?": {
        pros: ["Libertad elección", "Competencia calidad", "Empoderamiento de las familias"],
        cons: ["Segregación social", "Desmantela lo público", "Guetización de la escuela pública restante"]
    },
    "¿Eliminar exámenes de recuperación de junio/septiembre?": {
        pros: ["Esfuerzo constante", "Evaluación real", "Fomenta el hábito de estudio diario"],
        cons: ["Menos oportunidades", "Abandono escolar", "No tiene en cuenta problemas personales puntuales"]
    },
    "¿Educación financiera obligatoria en secundaria?": {
        pros: ["Preparación vida real", "Menos deudas", "Ciudadanos más conscientes y difíciles de estafar"],
        cons: ["Quita horas a humanidades", "Sesgo ideológico", "Enfoque materialista de la educación"]
    },
    "¿Gratuidad total de la Universidad (Grados y Máster)?": {
        pros: ["Acceso universal", "Mérito real", "Ascensor social real"],
        cons: ["Sostenibilidad financiera", "Masificación", "Riesgo de estudiantes 'eternos' sin incentivo"]
    },
    "¿Obligatoriedad del uniforme escolar en todos los centros?": {
        pros: ["Igualdad visual", "Ahorro ropa", "Elimina la 'marca-manía' y el bullying por ropa"],
        cons: ["Pérdida identidad", "Coste inicial", "Coarta la expresión de la personalidad"]
    },
    // Ciencia
    "¿Inversión del 3% del PIB en Ciencia?": {
        pros: ["Soberanía tecnológica", "Empleo calidad", "Cambio de modelo productivo país"],
        cons: ["Recortes en otros lados", "Déficit", "Resultados solo visibles a muy largo plazo"]
    },
    "¿Edición genética (CRISPR) en embriones humanos?": {
        pros: ["Erradicar enfermedades", "Avance médico", "Eliminación de dolor y sufrimiento hereditario"],
        cons: ["Eugenesia", "Riesgos desconocidos", "Creación de castas genéticas (The 'Gattaca' effect)"]
    },
    "¿Liberar patentes de vacunas y fármacos vitales?": {
        pros: ["Acceso global", "Salvar vidas", "Respuesta rápida a pandemias globales"],
        cons: ["Desincentiva investigación", "Pérdidas farma", "Menor calidad en la producción genérica"]
    },
    "¿Colonización de Marte: prioridad o distracción?": {
        pros: ["Futuro humanidad", "Tecnología derivada", "Plan B para la supervivencia de la especie"],
        cons: ["Problemas en la Tierra", "Gasto elitista", "Militarización del espacio"]
    },
    "¿Prohibir experimentación animal en cosmética/ciencia?": {
        pros: ["Ética animal", "Métodos alternativos", "Coherencia con valores animalistas actuales"],
        cons: ["Freno avances médicos", "Seguridad fármacos", "Retraso en biomedicina hasta tener alternativas"]
    },
    "¿Debe España tener su propia agencia espacial potente?": {
        pros: ["Autonomía estratégica", "Industria", "Retención de talento ingeniero nacional"],
        cons: ["Duplicidad ESA", "Coste", "Burocracia duplicada innecesaria"]
    },
    // Entretenimiento
    "¿Regular estrictamente la publicidad de apuestas?": {
        pros: ["Protección ludopatía", "Salud pública", "Protección de familias vulnerables"],
        cons: ["Ingresos clubes/TV", "Libertad empresa", "Menos patrocinio para deporte base"]
    },
    "¿Cánon digital en móviles y discos duros?": {
        pros: ["Apoyo creadores", "Compensación justa", "Sostenibilidad de la cultura"],
        cons: ["Paga justo por pecador", "Encarece tecnología", "Presunción de culpabilidad"]
    },
    "¿Subtitulado obligatorio vs Doblaje?": {
        pros: ["Mejora idiomas", "Obra original", "Mejora del nivel de inglés nacional"],
        cons: ["Dificultad lectura", "Industria doblaje", "Barrera para personas mayores o con visión reducida"]
    },
    "¿Limitar precios de reventa de entradas (conciertos)?": {
        pros: ["Acceso cultura", "Fin abusos", "Cultura accesible, no de lujo"],
        cons: ["Mercado libre", "Difícil control", "Aparición de mercados negros alternativos"]
    },
    "¿Derechos de autor para obras creadas por IA?": {
        pros: ["Protege inversión", "Nueva industria", "Incentiva el desarrollo de IA creativa"],
        cons: ["No es humano", "Robo de datos", "Satura el registro con obras automáticas"]
    },
    "¿Entradas de cine a precio reducido (2€) para mayores?": {
        pros: ["Acceso cultura", "Socialización", "Combate la soledad no deseada"],
        cons: ["Discriminación edad", "Déficit", "Agravio comparativo con jóvenes precarios"]
    }
};

async function forceUpdateArguments() {
    console.log("Starting FORCE update...");
    let updatedCount = 0;

    for (const [title, args] of Object.entries(FULL_ARGS)) {
        const { error } = await supabase
            .from('topics')
            .update({
                pros: args.pros,
                cons: args.cons
            })
            .eq('title', title);

        if (error) {
            console.error(`❌ Error updating ${title}:`, error.message);
        } else {
            // console.log(`✅ Updated: ${title}`);
            updatedCount++;
        }
    }
    console.log(`Finished. Updated ${updatedCount} topics with full 3 args.`);
}

forceUpdateArguments();
