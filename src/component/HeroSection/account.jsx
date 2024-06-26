/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UsersRound, UserRound, CircleUserRound, LogOut, User, Mail, Smartphone, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import AccountModal from '../modal/accountmodal'
import axios from 'axios'

const Account = () => {
    const isActive = (path) => location.pathname === path ? 'text-highlightColor' : 'text-white';

    const [isEdit, setIsEdit] = useState(false);
    const { id } = useParams()
    const getAccountDetail = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/me`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            setName(res.data.name)
            setEmail(res.data.email)
            setPhone(res.data.phone_no)
            console.log(res)
        } catch (error) {
            console.log('Error fething data:', error)
        }
    }
    useEffect(() => {
        getAccountDetail();
    }, [isEdit]);

    const [modal, setModal] = useState(false);
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState(null)
    const navigate = useNavigate();
    const handleLogout = () => {
        const f = 'Token'
        if (f == 'Token') {
            localStorage.removeItem('Token');
        }
        else {
            localStorage.removeItem('Token')
        }
        navigate('/signin');
    };


    return (
        <div className="bg-primaryColor h-svh flex flex-col">

            <div className='flex justify-between px-3'>
                <button className="py-3 flex items-center gap-2 bg-primaryColor" onClick={() => navigate(-1)}>
                    <ArrowLeft className="text-white" />
                    <h2 className="text-white text-base font-satoshi">back</h2>
                </button>
                <button className=''>
                    <Pencil className='text-white size-5 hover:text-textColor' onClick={() => setModal(true)} />
                </button>
            </div>

            <div className="px-4 flex flex-col items-center md:items-start">
                <h2 className="font-satoshi text-white py-2 text-2xl">Account</h2>
                <hr className="w-full" />

                <div className='flex gap-6 py-5 items-center w-full'>
                    {getAccountDetail ? (
                        <>
                            <div className='flex flex-col gap-5'>
                                <div className='flex gap-3'>
                                    <User className='text-white' />
                                    <h1 className='text-sm font-poppins text-white'>{name}</h1>
                                </div>
                                <div className='flex gap-3'>
                                    <Mail className='text-white' />
                                    <h2 className='text-sm font-poppins text-white'>{email}</h2>
                                </div>
                                <div className='flex gap-3'>
                                    <Smartphone className='text-white' />
                                    <h2 className='text-sm font-mono font-bold text-white'>{phone}</h2>
                                </div>

                            </div>
                        </>
                    ) : (
                        <span className='text-white'>Loading...</span>
                    )}

                </div>
                <div className="flex gap-2 items-center md:w-1/6 sm:w-1/6 lg:w-1/6 w-full">
                    <LogOut className="text-red-500" />
                    <button type="button" onClick={handleLogout} className="py-2 hover:border-4 hover:border-textColor  w-2/4 rounded-full bg-buttonColor font-bold font-satoshi text-lg text-black">
                        Logout
                    </button>
                </div>
            </div>
            {modal && <AccountModal onClose={() => setModal(false)} id={id} isEdit={isEdit} setIsEdit={setIsEdit} />}
            <div className="flex justify-around w-full fixed bottom-0 bg-primaryColor p-2">

                <button className="flex flex-col justify-center items-center" onClick={() => navigate("/")}>
                    <UsersRound className={`size-5 ${isActive('/')}`} />
                    <span className={`flex justify-start text-base font-satoshi ${isActive('/')}`}>Groups</span>
                </button>

                <button className="flex flex-col justify-center items-center" onClick={() => navigate("/friends")}>
                    <User className={`size-5 ${isActive('/friends')}`} />
                    <span className={`flex justify-start text-base font-satoshi ${isActive('/friends')}`}>Friends</span>
                </button>

                <button className="flex flex-col justify-center items-center" onClick={() => navigate("/accounts")}>
                    <CircleUserRound className={`size-5 ${isActive('/accounts')}`} />
                    <span className={`flex justify-start text-base font-satoshi ${isActive('/accounts')}`}>Account</span>
                </button>
            </div>
        </div>
    );
};

export default Account;
