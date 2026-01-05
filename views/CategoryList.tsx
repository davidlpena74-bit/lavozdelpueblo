
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../src/services/api';

const CATEGORIES = [
    { id: 'Política', name: 'Política', icon: '⚖️', description: 'Debates sobre gobierno, leyes y derechos.' },
    { id: 'Economía', name: 'Economía', icon: '💰', description: 'Impuestos, empleo, moneda y mercados.' },
    { id: 'Social', name: 'Social', icon: '🤝', description: 'Cuestiones sociales, igualdad y comunidad.' },
    { id: 'Medio Ambiente', name: 'Medio Ambiente', icon: '🌱', description: 'Cambio climático, energía y naturaleza.' },
    { id: 'Tecnología', name: 'Tecnología', icon: '💻', description: 'Innovación, IA y privacidad digital.' },
    { id: 'Sanidad', name: 'Sanidad', icon: '🏥', description: 'Salud pública, medicina y bienestar.' },
    { id: 'Educación', name: 'Educación', icon: '🎓', description: 'Sistema educativo, becas y docencia.' },
    { id: 'Ciencia', name: 'Ciencia', icon: '🔭', description: 'Investigación, espacio y descubrimientos.' },
    { id: 'Entretenimiento', name: 'Entretenimiento', icon: '🎭', description: 'Cine, música, cultura y ocio.' },
];

const CategoryList: React.FC = () => {
    const [userCount, setUserCount] = useState<number | null>(null);

    useEffect(() => {
        api.fetchUserCount().then(count => setUserCount(count));
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Elige tu Campo de Batalla
                </h1>
                {userCount !== null && (
                    <p className="mt-2 text-sm text-indigo-600 font-medium">
                        Ya somos <span className="font-bold text-lg">{userCount.toLocaleString()}</span> ciudadanos registrados
                    </p>
                )}
                <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                    Selecciona una categoría para explorar los debates activos y haz oír tu voz.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {CATEGORIES.map((category) => (
                    <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 flex flex-col items-center text-center"
                    >
                        <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-indigo-50 text-3xl mb-4 group-hover:scale-110 transition-transform">
                            {category.icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                <span className="absolute inset-0" aria-hidden="true" />
                                {category.name}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {category.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link to="/latest" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Ver todos los temas recientes &rarr;
                </Link>
            </div>
        </div>
    );
};

export default CategoryList;
