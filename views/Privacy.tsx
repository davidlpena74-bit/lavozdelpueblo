
import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Política de Privacidad</h1>

            <div className="prose prose-indigo text-gray-500">
                <p className="mb-4">
                    En La Voz del Pueblo, nos tomamos muy en serio tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Información que Recopilamos</h2>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li><strong>Datos de Registro:</strong> Correo electrónico, nombre de usuario y contraseña (cifrada).</li>
                    <li><strong>Perfil Demográfico:</strong> Edad, ocupación, género y comunidad autónoma. Estos datos se utilizan para segmentar estadísticas.</li>
                    <li><strong>Actividad:</strong> Tu historial de votos y propuestas en la plataforma.</li>
                </ul>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Uso de la Información</h2>
                <p className="mb-4">
                    Utilizamos tus datos exclusivamente para:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Gestionar tu cuenta y autenticación.</li>
                    <li>Generar estadísticas demográficas anónimas sobre las votaciones (ej. "¿Qué opinan los estudiantes en Madrid?").</li>
                    <li>Mejorar la experiencia de usuario en la plataforma.</li>
                </ul>
                <p className="mb-4 font-semibold">
                    Nunca vendemos tus datos personales a terceros.
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Seguridad de los Datos</h2>
                <p className="mb-4">
                    Utilizamos Supabase como proveedor de infraestructura, que implementa estándares de seguridad de la industria (cifrado en tránsito y en reposo) para proteger tu información.
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Tus Derechos</h2>
                <p className="mb-4">
                    Tienes derecho a acceder, rectificar o eliminar tus datos personales en cualquier momento. Puedes gestionar tu perfil desde la sección "Mi Perfil" o contactarnos para una eliminación completa de la cuenta.
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Cookies</h2>
                <p className="mb-4">
                    Utilizamos cookies esenciales para mantener tu sesión iniciada. No utilizamos cookies de rastreo publicitario de terceros.
                </p>

                <p className="mt-8 text-sm text-gray-400">
                    Última actualización: Enero 2026
                </p>
            </div>
        </div>
    );
};

export default Privacy;
