import React, { useState, useEffect } from 'react';
import { api } from '../src/services/api';
import { RegionCode } from '../types';
import { validateDNI } from '../src/utils/validation';
import { supabase } from '../src/services/supabase'; // Direct import to fetch DNI on load if not in session

interface UserProfileProps {
    user: {
        id: string;
        name: string;
        avatar: string;
        email: string;
        region?: string;
    };
}

const REGIONS: { code: RegionCode; name: string }[] = [
    { code: 'MD', name: 'Madrid' }, { code: 'CT', name: 'Cataluña' }, { code: 'AN', name: 'Andalucía' },
    { code: 'VC', name: 'Comunidad Valenciana' }, { code: 'GA', name: 'Galicia' }, { code: 'PV', name: 'País Vasco' },
    { code: 'CL', name: 'Castilla y León' }, { code: 'CM', name: 'Castilla-La Mancha' }, { code: 'AR', name: 'Aragón' },
    { code: 'EX', name: 'Extremadura' }, { code: 'IB', name: 'Baleares' }, { code: 'CN', name: 'Canarias' },
    { code: 'AS', name: 'Asturias' }, { code: 'CB', name: 'Cantabria' }, { code: 'NC', name: 'Navarra' },
    { code: 'MC', name: 'Murcia' }, { code: 'RI', name: 'La Rioja' }, { code: 'CE', name: 'Ceuta' },
    { code: 'ML', name: 'Melilla' }
];

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const [region, setRegion] = useState<string>(user.region || '');
    const [dni, setDni] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Sync local state if user prop changes
    useEffect(() => {
        setRegion(user.region || '');
        // Fetch DNI separately since it might not be in the passed user object yet (depends on App.tsx)
        const fetchExtendedProfile = async () => {
            const { data } = await supabase.from('profiles').select('dni').eq('id', user.id).single();
            if (data?.dni) setDni(data.dni);
        };
        fetchExtendedProfile();
    }, [user.id, user.region]);

    const handleSave = async () => {
        setMessage(null);

        // Validate DNI if provided
        if (dni && !validateDNI(dni)) {
            setMessage({ type: 'error', text: 'El DNI introducido no es válido. Verifica la letra.' });
            return;
        }

        setSaving(true);
        try {
            await api.updateUserProfile(user.id, {
                region: region as RegionCode,
                dni: dni || undefined
            });
            setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Error al actualizar: ' + error.message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-bold text-gray-900">Mi Perfil</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles de tu cuenta en La Voz Del Pueblo.</p>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Avatar</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <img className="h-16 w-16 rounded-full border-2 border-indigo-100" src={user.avatar} alt="Avatar" />
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Nombre de Usuario</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">{user.name}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Correo Electrónico</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                        </div>

                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 pt-3">DNI / NIF</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <input
                                    type="text"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value.toUpperCase())}
                                    placeholder="12345678Z"
                                    maxLength={9}
                                    className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono uppercase"
                                />
                                <p className="mt-1 text-xs text-gray-400">Introduce tu DNI con letra para verificar tu identidad.</p>
                            </dd>
                        </div>

                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 pt-3">Comunidad Autónoma</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex flex-col space-y-3">
                                    <select
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                        className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                                    >
                                        <option value="" disabled>Selecciona tu CCAA...</option>
                                        {REGIONS.map(r => (
                                            <option key={r.code} value={r.code}>{r.name}</option>
                                        ))}
                                    </select>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                                        </button>
                                        {message && (
                                            <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                                {message.text}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400">Tu CCAA se utiliza para registrar tus votos automáticamente.</p>
                                </div>
                            </dd>
                        </div>

                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">ID de Usuario</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono text-xs text-gray-400 select-all">
                                {user.id}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
