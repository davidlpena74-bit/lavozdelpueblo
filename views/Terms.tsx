
import React from 'react';

const Terms: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Términos y Condiciones de Uso</h1>

            <div className="prose prose-indigo text-gray-500">
                <p className="mb-4">
                    Bienvenido a La Voz del Pueblo. Al acceder y utilizar nuestra plataforma, aceptas cumplir con los siguientes términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, por favor no utilices nuestros servicios.
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Uso de la Plataforma</h2>
                <p className="mb-4">
                    Nuestra misión es fomentar el debate democrático y la participación ciudadana. Al usar la plataforma, te comprometes a:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Mantener un tono respetuoso y constructivo en los debates.</li>
                    <li>No publicar contenido ofensivo, discriminatorio o ilegal.</li>
                    <li>Proporcionar información veraz en tu perfil de usuario.</li>
                    <li>No intentar manipular las votaciones mediante el uso de bots o cuentas falsas (salvo las generadas por el sistema para demostraciones internas).</li>
                </ul>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Registro y Seguridad</h2>
                <p className="mb-4">
                    Para participar en las votaciones, es necesario registrarse. Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de toda la actividad que ocurra bajo tu cuenta.
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Propiedad Intelectual</h2>
                <p className="mb-4">
                    El contenido generado por los usuarios (comentarios, propuestas) es propiedad de sus respectivos autores, pero al publicarlo en La Voz del Pueblo, nos otorgas una licencia no exclusiva para mostrarlo y utilizarlo con fines estadísticos y analíticos.
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Limitación de Responsabilidad</h2>
                <p className="mb-4">
                    La Voz del Pueblo ofrece esta plataforma "tal cual" para fines informativos y de participación. No nos hacemos responsables de las opiniones vertidas por los usuarios ni garantizamos que los resultados de las votaciones sean vinculantes para ninguna institución gubernamental.
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Modificaciones</h2>
                <p className="mb-4">
                    Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios significativos a través de la plataforma.
                </p>

                <p className="mt-8 text-sm text-gray-400">
                    Última actualización: Enero 2026
                </p>
            </div>
        </div>
    );
};

export default Terms;
