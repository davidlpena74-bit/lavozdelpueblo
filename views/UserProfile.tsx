import React, { useState, useEffect } from 'react';
import { api } from '../src/services/api';
import { RegionCode, OccupationType, GenderType } from '../types';
import { validateDNI } from '../src/utils/validation';
import { supabase } from '../src/services/supabase'; // Direct import to fetch DNI on load if not in session

interface UserProfileProps {
    user: {
        id: string;
        name: string;
        avatar: string;
        email: string;
        region?: string;
        is_fake?: boolean;
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

const OCCUPATIONS: OccupationType[] = [
    'Estudiante',
    'Desempleado',
    'Trabajador Manual / Obrero',
    'Trabajador Servicios / Administrativo',
    'Profesional Técnico / Autónomo',
    'Directivo / Empresario',
    'Jubilado',
    'Otras'
];

const GENDERS: GenderType[] = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const [region, setRegion] = useState<string>(user.region || '');
    const [dni, setDni] = useState<string>('');
    const [avatar, setAvatar] = useState<string>(user.avatar || '');
    const [age, setAge] = useState<string>(''); // Keep as string for input handling
    const [occupation, setOccupation] = useState<string>('');
    const [gender, setGender] = useState<string>('');

    // Tracking initial values for dirty check
    const [initialState, setInitialState] = useState({
        dni: '',
        age: '',
        occupation: '',
        gender: ''
    });

    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Generate avatar options
    const avatarOptions = [
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
        `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`,
        `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
        `https://api.dicebear.com/7.x/lorelei/svg?seed=${user.name}`,
        `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`,
        `https://api.dicebear.com/7.x/micah/svg?seed=${user.name}`
    ];

    // Sync local state if user prop changes
    useEffect(() => {
        setRegion(user.region || '');
        setAvatar(user.avatar || '');
        // Fetch extended profile
        const fetchExtendedProfile = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('dni, avatar_url, age, occupation, gender')
                .eq('id', user.id)
                .single();

            if (data) {
                const newDni = data.dni || '';
                const newAge = data.age ? data.age.toString() : '';
                const newOccupation = data.occupation || '';
                const newGender = data.gender || '';

                setDni(newDni);
                setAge(newAge);
                setOccupation(newOccupation);
                setGender(newGender);

                if (data.avatar_url) setAvatar(data.avatar_url);

                setInitialState({
                    dni: newDni,
                    age: newAge,
                    occupation: newOccupation,
                    gender: newGender
                });
            }
        };
        fetchExtendedProfile();
    }, [user.id, user.region, user.avatar]);

    const isDirty =
        (region !== (user.region || '')) ||
        (avatar !== user.avatar) ||
        (dni !== initialState.dni) ||
        (age !== initialState.age) ||
        (occupation !== initialState.occupation) ||
        (gender !== initialState.gender);

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
                dni: dni || undefined,
                avatar_url: avatar,
                age: age ? parseInt(age) : undefined,
                occupation: occupation as OccupationType || undefined,
                gender: gender as GenderType || undefined
            });
            setMessage({ type: 'success', text: 'Perfil actualizado correctamente. Recarga para actualizar tu foto en toda la app.' });

            setInitialState({
                dni,
                age,
                occupation,
                gender
            });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Error al actualizar: ' + error.message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Avatar Selection Modal */}
            {showAvatarModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowAvatarModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Elige tu Avatar</h3>
                                        <div className="mt-4 grid grid-cols-3 gap-4">
                                            {avatarOptions.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        setAvatar(opt);
                                                        setShowAvatarModal(false);
                                                    }}
                                                    className={`aspect-w-1 aspect-h-1 rounded-full border-2 overflow-hidden hover:opacity-80 transition-all ${avatar === opt ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent'}`}
                                                >
                                                    <img src={opt} alt={`Option ${idx}`} className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShowAvatarModal(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                <div className="flex items-center space-x-4">
                                    <img className="h-16 w-16 rounded-full border-2 border-indigo-100" src={avatar} alt="Avatar" />
                                    <button
                                        onClick={() => setShowAvatarModal(true)}
                                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium hover:underline"
                                    >
                                        Cambiar foto
                                    </button>
                                </div>
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Nombre de Usuario</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium flex items-center">
                                {user.name}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Correo Electrónico</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                        </div>

                        {/* Occupation */}
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 pt-3">Ocupación / Clase</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <select
                                    value={occupation}
                                    onChange={(e) => setOccupation(e.target.value)}
                                    className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                                >
                                    <option value="" disabled>Selecciona tu ocupación...</option>
                                    {OCCUPATIONS.map(occ => (
                                        <option key={occ} value={occ}>{occ}</option>
                                    ))}
                                </select>
                            </dd>
                        </div>

                        {/* Age and Gender */}
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 pt-3">Datos Demográficos</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="grid grid-cols-2 gap-4 max-w-xs">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Edad</label>
                                        <input
                                            type="number"
                                            min="16"
                                            max="120"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Género</label>
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="block w-full pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="" disabled>Selecciona...</option>
                                            {GENDERS.map(g => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </dd>
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
                                    <p className="text-xs text-gray-400">Tu CCAA se utiliza para registrar tus votos automáticamente.</p>
                                </div>
                            </dd>
                        </div>

                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">ID de Usuario</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono text-xs text-gray-400 select-all">
                                {user.id}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div >
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
                <div className="flex items-center justify-end space-x-3">
                    {message && (
                        <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving || !isDirty}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default UserProfile;
