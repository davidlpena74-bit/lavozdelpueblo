
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const TOPICS_TO_INSERT = [
    // Política
    { title: '¿Debería ser obligatorio el voto a partir de los 16 años?', category: 'Política', description: 'Debate sobre la reducción de la edad legal para votar en elecciones generales y autonómicas.', pros: ['Fomenta la participación joven', 'Representación intergeneracional'], cons: ['Falta de madurez política', 'Influencia familiar excesiva'], ai_analysis: 'Tendencia creciente en Europa para involucrar a la juventud.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Estás a favor de listas abiertas en las elecciones?', category: 'Política', description: 'Permitir a los votantes seleccionar candidatos individuales en lugar de partidos cerrados.', pros: ['Mayor conexión elector-representante', 'Reduce el poder de las cúpulas'], cons: ['Complejidad del recuento', 'Riesgo de clientelismo'], ai_analysis: 'Mejoraría la calidad democrática y la rendición de cuentas.', label_support: 'A favor', label_oppose: 'En contra' },
    { title: '¿Eliminar la inmunidad parlamentaria?', category: 'Política', description: 'Propuesta para que los políticos puedan ser juzgados por tribunales ordinarios sin suplicatorios.', pros: ['Igualdad ante la ley', 'Menos impunidad'], cons: ['Riesgo de persecución política', 'Desprotección de la oposición'], ai_analysis: 'Medida popular para combatir la corrupción.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Debería limitarse el mandato presidencial a 8 años?', category: 'Política', description: 'Evitar que un presidente del gobierno esté más de dos legislaturas en el poder.', pros: ['Evita el caudillismo', 'Renovación política'], cons: ['Pérdida de experiencia', 'Interrupción de proyectos largos'], ai_analysis: 'Estándar en muchas democracias occidentales.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Financiación exclusivamente pública de partidos?', category: 'Política', description: 'Prohibir donaciones privadas para evitar favores políticos.', pros: ['Menor corrupción', 'Independencia de lobbies'], cons: ['Mayor gasto estatal', 'Partidos dependientes del gobierno'], ai_analysis: 'Busca mayor transparencia en la gestión pública.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Referéndum sobre la forma de Estado (Monarquía/República)?', category: 'Política', description: 'Consulta vinculante para decidir la jefatura del estado.', pros: ['Soberanía popular', 'Modernización'], cons: ['Desestabilización', 'Tradición'], ai_analysis: 'Eterno debate constitucional.', label_support: 'Sí', label_oppose: 'No' },

    // Economía
    { title: '¿Implantar la semana laboral de 4 días?', category: 'Economía', description: 'Reducir la jornada laboral a 32 horas semanales sin reducción de sueldo.', pros: ['Mejor conciliación', 'Aumento de productividad'], cons: ['Costes para PYMES', 'Difícil en sector servicios'], ai_analysis: 'Experimentos piloto muestran resultados mixtos pero prometedores.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Regular precios de alquiler por ley?', category: 'Economía', description: 'Establecer topes máximos al precio del alquiler en zonas tensionadas.', pros: ['Acceso a vivienda digna', 'Freno a la especulación'], cons: ['Reducción de oferta', 'Mercado negro'], ai_analysis: 'Debate intenso entre derecho a la vivienda y libertad de mercado.', label_support: 'Regular', label_oppose: 'Libre mercado' },
    { title: '¿Impuesto específico a grandes fortunas?', category: 'Economía', description: 'Tasa adicional para patrimonios superiores a 3 millones de euros.', pros: ['Redistribución de riqueza', 'Justicia fiscal'], cons: ['Fuga de capitales', 'Doble imposición'], ai_analysis: 'Medida para reducir la desigualdad económica creciente.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Uso de criptomonedas como moneda de curso legal?', category: 'Economía', description: 'Aceptación oficial de Bitcoin y otras criptos para pagos cotidianos.', pros: ['Innovación financiera', 'Independencia bancaria'], cons: ['Volatilidad extrema', 'Riesgo de blanqueo'], ai_analysis: 'Arriesgado para la estabilidad económica nacional.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Subida del Salario Mínimo a 1.500€?', category: 'Economía', description: 'Propuesta para ajustar el SMI al coste de vida real en grandes ciudades.', pros: ['Dignidad laboral', 'Reactiva consumo interno'], cons: ['Pérdida de empleo', 'Inflación de costes'], ai_analysis: 'Necesario ante la inflación acumulada.', label_support: 'A favor', label_oppose: 'En contra' },
    { title: '¿Impuesto global a las multinacionales tecnológicas?', category: 'Economía', description: 'Tasa mínima del 15% para evitar paraísos fiscales.', pros: ['Justicia fiscal', 'Ingresos públicos'], cons: ['Fuga de inversión', 'Repercusión precios'], ai_analysis: 'Acuerdo OCDE pendiente de aplicación total.', label_support: 'Sí', label_oppose: 'No' },

    // Social
    { title: '¿Legalización de la gestación subrogada?', category: 'Social', description: 'Regular la práctica de los "vientres de alquiler" de forma altruista o comercial.', pros: ['Derecho a formar familia', 'Libertad individual'], cons: ['Mercantilización del cuerpo', 'Explotación de mujeres pobres'], ai_analysis: 'Conflicto ético y feminista muy polarizado.', label_support: 'Legalizar', label_oppose: 'Prohibir' },
    { title: '¿Legalización de la marihuana recreativa?', category: 'Social', description: 'Permitir venta y consumo de cannabis para adultos.', pros: ['Impuestos para el estado', 'Fin de mafias'], cons: ['Riesgos salud pública', 'Adicción en jóvenes'], ai_analysis: 'Tendencia global hacia la regularización.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Prohibición total de la tauromaquia?', category: 'Social', description: 'Eliminar corridas de toros y festejos taurinos.', pros: ['Derechos animales', 'Fin de la tortura'], cons: ['Tradición cultural', 'Impacto económico ganadero'], ai_analysis: 'Creciente rechazo social al maltrato animal.', label_support: 'Prohibir', label_oppose: 'Mantener' },
    { title: '¿Permisos de paternidad iguales e intransferibles?', category: 'Social', description: 'Obligar a que ambos progenitores tomen su baja sin poder cederla.', pros: ['Igualdad laboral', 'Corresponsabilidad'], cons: ['Menor libertad de organización', 'Coste empresarial'], ai_analysis: 'Clave para cerrar la brecha de género laboral.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Ley de Eutanasia más amplia?', category: 'Social', description: 'Incluir supuestos de sufrimiento psíquico insoportable o demencias.', pros: ['Muerte digna', 'Autonomía del paciente'], cons: ['Pendiente resbaladiza', 'Ética médica'], ai_analysis: 'Debate sobre los límites de la dignidad y la vida.', label_support: 'Ampliar', label_oppose: 'Restringir' },
    { title: '¿Baja laboral por dolores menstruales incapacitantes?', category: 'Social', description: 'Reconocimiento de derecho específico sin penalización.', pros: ['Derechos mujer', 'Salud real'], cons: ['Estigmatización', 'Contratación'], ai_analysis: 'Medida pionera aprobada recientemente.', label_support: 'A favor', label_oppose: 'En contra' },

    // Medio Ambiente
    { title: '¿Prohibición de venta de coches diésel/gasolina en 2030?', category: 'Medio Ambiente', description: 'Acelerar la transición al vehículo eléctrico prohibiendo combustión.', pros: ['Reducción emisiones', 'Aire más limpio'], cons: ['Precio coches eléctricos', 'Infraestructura insuficiente'], ai_analysis: 'Necesario para objetivos climáticos pero reto logístico.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Cierre de macro-granjas intensivas?', category: 'Medio Ambiente', description: 'Limitar el tamaño de explotaciones ganaderas por impacto ambiental.', pros: ['Menos contaminación nitratos', 'Bienestar animal'], cons: ['Carne más cara', 'Pérdida empleo rural'], ai_analysis: 'Conflicto entre sostenibilidad y producción masiva.', label_support: 'Cerrar', label_oppose: 'Mantener' },
    { title: '¿Energía Nuclear como "Verde"?', category: 'Medio Ambiente', description: 'Considerar la nuclear clave para la transición energética.', pros: ['Sin emisiones CO2', 'Energía base estable'], cons: ['Residuos radiactivos', 'Riesgo accidentes'], ai_analysis: 'Debate reabierto por la crisis energética.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Impuestos altos al plástico de un solo uso?', category: 'Medio Ambiente', description: 'Gravar fuertemente envases y utensilios desechables.', pros: ['Reduce residuos', 'Fomenta reutilización'], cons: ['Coste cesta compra', 'Adaptación industrial'], ai_analysis: 'Medida urgente contra la contaminación plástica.', label_support: 'A favor', label_oppose: 'En contra' },
    { title: '¿Restricciones permanentes de agua en el sur?', category: 'Medio Ambiente', description: 'Asumir la sequía estructural y limitar regadíos para siempre.', pros: ['Sostenibilidad real', 'Proteger ecosistemas'], cons: ['Fin agricultura intensiva', 'Despoblación'], ai_analysis: 'Adaptación necesaria al cambio climático en España.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Prohibición de viajar en jet privado en la UE?', category: 'Medio Ambiente', description: 'Veto a vuelos cortos privados por alta contaminación.', pros: ['Justicia climática', 'Emisiones'], cons: ['Libertad movimiento', 'Negocios'], ai_analysis: 'Símbolo de desigualdad climática.', label_support: 'Prohibir', label_oppose: 'Permitir' },

    // Tecnología
    { title: '¿Pausar el desarrollo de IA avanzada?', category: 'Tecnología', description: 'Moratoria en el entrenamiento de IAs más potentes que GPT-4.', pros: ['Seguridad y control', 'Evaluación ética'], cons: ['Freno a la innovación', 'Ventaja para China/Rusia'], ai_analysis: 'Temor a riesgos existenciales no controlados.', label_support: 'Pausar', label_oppose: 'Continuar' },
    { title: '¿Prohibir TikTok por seguridad nacional?', category: 'Tecnología', description: 'Vetar la app propiedad de ByteDance por posible espionaje.', pros: ['Protección de datos', 'Soberanía digital'], cons: ['Censura', 'Libertad de expresión'], ai_analysis: 'Tensión geopolítica tecnológica.', label_support: 'Prohibir', label_oppose: 'Permitir' },
    { title: '¿Identidad Digital Europea obligatoria?', category: 'Tecnología', description: 'Unificar DNI, carnet conducir y salud en una app móvil UE.', pros: ['Comodidad', 'Burocracia ágil'], cons: ['Riesgo hackeo masivo', 'Vigilancia estatal'], ai_analysis: 'Paso hacia la integración digital total.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Prohibir móviles en colegios e institutos?', category: 'Tecnología', description: 'Restricción total de dispositivos personales en horario lectivo.', pros: ['Mejora atención', 'Menos ciberbullying'], cons: ['Herramienta educativa', 'Control parental'], ai_analysis: 'Medida adoptada ya por varias comunidades.', label_support: 'Prohibir', label_oppose: 'Permitir' },
    { title: '¿Derecho a la desconexión digital estricto?', category: 'Tecnología', description: 'Multas a empresas que contacten fuera del horario laboral.', pros: ['Salud mental', 'Respeto al descanso'], cons: ['Rigidez laboral', 'Problemas en urgencias'], ai_analysis: 'Necesario en la era del teletrabajo.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Implantar chip cerebral (Neuralink) en humanos sanos?', category: 'Tecnología', description: 'Mejora cognitiva mediante interfaz cerebro-máquina.', pros: ['Superar limitaciones', 'Competir con IA'], cons: ['Hackeo cerebral', 'Desigualdad'], ai_analysis: 'Futurismo transhumanista.', label_support: 'A favor', label_oppose: 'En contra' },

    // Sanidad
    { title: '¿Incluir psicólogos y dentista en la Seguridad Social?', category: 'Sanidad', description: 'Cobertura total de salud mental y bucodental pública.', pros: ['Salud integral', 'Equidad social'], cons: ['Alto coste fiscal', 'Colapso de listas espera'], ai_analysis: 'Reivindicación histórica pendiente.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Copago en urgencias no justificadas?', category: 'Sanidad', description: 'Cobrar una tasa por visitar urgencias si no es real emergencia.', pros: ['Disuade abuso', 'Mejor atención real'], cons: ['Penaliza a pobres', 'Riesgo diagnóstico'], ai_analysis: 'Medida impopular pero eficiente en gestión.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Vacunación obligatoria para acceder a escuelas?', category: 'Sanidad', description: 'Exigir calendario vacunal completo para matricularse.', pros: ['Inmunidad de rebaño', 'Protección menores'], cons: ['Libertad individual', 'Derecho educación'], ai_analysis: 'Debate salud pública vs libertades.', label_support: 'Obligatoria', label_oppose: 'Voluntaria' },
    { title: '¿Gestión privada de hospitales públicos?', category: 'Sanidad', description: 'Modelo de concesión privada para gestionar centros públicos.', pros: ['Eficiencia gestión', 'Menor coste'], cons: ['Peor calidad servicio', 'Precarización laboral'], ai_analysis: 'La llamada "Marea Blanca" defiende lo público.', label_support: 'Pública', label_oppose: 'Privada' },
    { title: '¿Prohibir venta de bebidas energéticas a menores?', category: 'Sanidad', description: 'Equiparar estas bebidas al alcohol para menores de 18.', pros: ['Salud cardiovascular', 'Menos obesidad'], cons: ['Exceso regulación', 'Daño industria'], ai_analysis: 'Preocupación por consumo en adolescentes.', label_support: 'Prohibir', label_oppose: 'Permitir' },
    { title: '¿Vacuna contra el cáncer: pública o patente?', category: 'Sanidad', description: 'Si se logra, ¿cómo debe distribuirse?', pros: ['Acceso universal', 'Bien común'], cons: ['Incentivo inversión', 'Propiedad'], ai_analysis: 'Hito médico en el horizonte cercano.', label_support: 'Pública', label_oppose: 'Privada' },

    // Educación
    { title: '¿Selectividad (EBAU) única para toda España?', category: 'Educación', description: 'Mismo examen y criterios para todas las CCAA.', pros: ['Igualdad oportunidades', 'Justicia acceso'], cons: ['Centralización', 'Diferencias currículo'], ai_analysis: 'Demanda constante de estudiantes y regiones.', label_support: 'Única', label_oppose: 'Autonómica' },
    { title: '¿Cheque escolar para elegir centro concertado/privado?', category: 'Educación', description: 'El estado da el dinero a la familia, no al colegio.', pros: ['Libertad elección', 'Competencia calidad'], cons: ['Segregación social', 'Desmantela lo público'], ai_analysis: 'Modelo liberal vs modelo integrador.', label_support: 'A favor', label_oppose: 'En contra' },
    { title: '¿Eliminar exámenes de recuperación de junio/septiembre?', category: 'Educación', description: 'Evaluación continua real sin opción a "salvar el curso" al final.', pros: ['Esfuerzo constante', 'Evaluación real'], cons: ['Menos oportunidades', 'Abandono escolar'], ai_analysis: 'Cambio pedagógico reciente y polémico.', label_support: 'Eliminar', label_oppose: 'Mantener' },
    { title: '¿Educación financiera obligatoria en secundaria?', category: 'Educación', description: 'Asignatura troncal sobre impuestos, hipotecas y ahorro.', pros: ['Preparación vida real', 'Menos deudas'], cons: ['Quita horas a humanidades', 'Sesgo ideológico'], ai_analysis: 'Carencia detectada en currículo actual.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Gratuidad total de la Universidad (Grados y Máster)?', category: 'Educación', description: 'Eliminar tasas de matrícula en la pública.', pros: ['Acceso universal', 'Mérito real'], cons: ['Sostenibilidad financiera', 'Masificación'], ai_analysis: 'Inversión en capital humano futuro.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Obligatoriedad del uniforme escolar en todos los centros?', category: 'Educación', description: 'Imponer vestimenta única pública y concertada.', pros: ['Igualdad visual', 'Ahorro ropa'], cons: ['Pérdida identidad', 'Coste inicial'], ai_analysis: 'Debate clásico de vuelta.', label_support: 'Obligatorio', label_oppose: 'Libre' },

    // Ciencia
    { title: '¿Inversión del 3% del PIB en Ciencia?', category: 'Ciencia', description: 'Blindar por ley el presupuesto de I+D+i.', pros: ['Soberanía tecnológica', 'Empleo calidad'], cons: ['Recortes en otros lados', 'Déficit'], ai_analysis: 'España está lejos de la media europea.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Edición genética (CRISPR) en embriones humanos?', category: 'Ciencia', description: 'Permitir modificar ADN para evitar enfermedades hereditarias.', pros: ['Erradicar enfermedades', 'Avance médico'], cons: ['Eugenesia', 'Riesgos desconocidos'], ai_analysis: 'Dilema bioético del siglo XXI.', label_support: 'Permitir', label_oppose: 'Prohibir' },
    { title: '¿Liberar patentes de vacunas y fármacos vitales?', category: 'Ciencia', description: 'Eliminar propiedad intelectual en crisis sanitarias.', pros: ['Acceso global', 'Salvar vidas'], cons: ['Desincentiva investigación', 'Pérdidas farma'], ai_analysis: 'Debate tras la pandemia COVID.', label_support: 'Liberar', label_oppose: 'Proteger' },
    { title: '¿Colonización de Marte: prioridad o distracción?', category: 'Ciencia', description: 'Invertir recursos públicos en la carrera espacial tripulada.', pros: ['Futuro humanidad', 'Tecnología derivada'], cons: ['Problemas en la Tierra', 'Gasto elitista'], ai_analysis: '¿Arreglar el planeta o buscar otro?', label_support: 'Prioridad', label_oppose: 'Distracción' },
    { title: '¿Prohibir experimentación animal en cosmética/ciencia?', category: 'Ciencia', description: 'Fin total al uso de animales en laboratorios.', pros: ['Ética animal', 'Métodos alternativos'], cons: ['Freno avances médicos', 'Seguridad fármacos'], ai_analysis: 'Presión social creciente por bienestar animal.', label_support: 'Prohibir', label_oppose: 'Permitir' },
    { title: '¿Debe España tener su propia agencia espacial potente?', category: 'Ciencia', description: 'Aumentar competencias de la nueva Agencia Espacial Española.', pros: ['Autonomía estratégica', 'Industria'], cons: ['Duplicidad ESA', 'Coste'], ai_analysis: 'Sede recién elegida en Sevilla.', label_support: 'Sí', label_oppose: 'No' },

    // Entretenimiento
    { title: '¿Regular estrictamente la publicidad de apuestas?', category: 'Entretenimiento', description: 'Prohibir anuncios de casas de apuestas en horario deportivo.', pros: ['Protección ludopatía', 'Salud pública'], cons: ['Ingresos clubes/TV', 'Libertad empresa'], ai_analysis: 'Problema creciente en barrios obreros.', label_support: 'Regular', label_oppose: 'Dejar igual' },
    { title: '¿Cánon digital en móviles y discos duros?', category: 'Entretenimiento', description: 'Tasa compensatoria por copia privada al comprar dispositivos.', pros: ['Apoyo creadores', 'Compensación justa'], cons: ['Paga justo por pecador', 'Encarece tecnología'], ai_analysis: 'Impuesto polémico de la SGAE y otros.', label_support: 'A favor', label_oppose: 'En contra' },
    { title: '¿Subtitulado obligatorio vs Doblaje?', category: 'Entretenimiento', description: 'Fomentar VOSE (Versión Original) en cines y TV pública.', pros: ['Mejora idiomas', 'Obra original'], cons: ['Dificultad lectura', 'Industria doblaje'], ai_analysis: 'España es país de doblaje por tradición.', label_support: 'Fomentar VOSE', label_oppose: 'Mantener Doblaje' },
    { title: '¿Limitar precios de reventa de entradas (conciertos)?', category: 'Entretenimiento', description: 'Prohibir reventa especulativa por encima del precio facial.', pros: ['Acceso cultura', 'Fin abusos'], cons: ['Mercado libre', 'Difícil control'], ai_analysis: 'Polémica por conciertos masivos recientes.', label_support: 'Limitar', label_oppose: 'Libre' },
    { title: '¿Derechos de autor para obras creadas por IA?', category: 'Entretenimiento', description: '¿Debe tener copyright el arte o guión generado por ChatGPT/Midjourney?', pros: ['Protege inversión', 'Nueva industria'], cons: ['No es humano', 'Robo de datos'], ai_analysis: 'La gran batalla legal de Hollywood actual.', label_support: 'Sí', label_oppose: 'No' },
    { title: '¿Entradas de cine a precio reducido (2€) para mayores?', category: 'Entretenimiento', description: 'Subvención para recuperar público senior en salas.', pros: ['Acceso cultura', 'Socialización'], cons: ['Discriminación edad', 'Déficit'], ai_analysis: 'Medida actual del gobierno.', label_support: 'Sí', label_oppose: 'No' }
];

async function seed() {
    console.log('Starting seed via API...');

    // 1. Authenticate (required to insert if RLS is on for users)
    // We try to sign up/in a seeder user
    const email = `seeder_${Date.now()}@admin.local`;
    const password = 'supersecretpassword123';

    let { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password
    });

    if (authError || !user) {
        console.error('Failed to create temp seeder user:', authError);
        // Try to proceed anyway (maybe RLS is off?)
    } else {
        console.log('Created and logged in as temp user:', user.id);
    }

    // 2. Insert topics
    let count = 0;
    for (const t of TOPICS_TO_INSERT) {
        // Check if exists
        const { data: existing } = await supabase.from('topics').select('id').eq('title', t.title).single();
        if (existing) {
            console.log(`Skipping existing: ${t.title}`);
            continue;
        }

        const { error } = await supabase.from('topics').insert(t);
        if (error) {
            console.error(`Error inserting ${t.title}:`, error.message);
        } else {
            console.log(`Inserted: ${t.title}`);
            count++;
        }
    }

    console.log(`Finished. Inserted ${count} topics.`);
}

seed();
