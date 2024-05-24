import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import Modal from "../../component/modal/modal";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Settings, UsersRound, UserRound, CircleUserRound, ReceiptText } from 'lucide-react';

const GroupInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [modals, setModals] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const isActive = (path) => location.pathname === path ? 'text-highlightColor' : 'text-white';
  const groupColor = location.state?.color || '#7c3aed'; // Default color if none is passed

  const getGroupApi = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      setGroup(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const expenseList = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/expenses/?includes=user,userExpenses&group_id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      setExpenses(res.data);
    } catch (error) {
      console.error("Expense List", error);
    }
  };

  useEffect(() => {
    getGroupApi();
    expenseList();
  }, [id]);

  return (
    <div className='h-screen bg-primaryColor flex flex-col'>
      <div className="flex w-full justify-between px-3 pt-3">
        <button className='flex items-center flex-row-reverse gap-2' onClick={() => navigate(-1)}>
          <h2 className='text-white text-base font-satoshi'>back</h2>
          <ArrowLeft className='text-white' />
        </button>
        <Link to={`/group/${id}/settings`} state={{ color: groupColor }}>
          <Settings className='text-white hover:text-textColor' />
        </Link>
      </div>

      <div className="relative pl-5 pt-3 flex items-center">
        <div
          className="w-14 h-14 rounded-2xl mr-4"
          style={{ backgroundColor: groupColor }}
        ></div>
        <div>
          <h1 className="font-satoshi text-lg text-white">{group?.name}</h1>
          <h2 className="font-satoshi text-sm text-white">{group?.description}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 mb-20"> {/* Adjusted for spacing */}
        {expenses.map((expense) => {
          const date = new Date(expense.date);
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const day = date.getDate();

          return (
            <div key={expense.id} className="my-4 p-4 bg-stone-700 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-bold font-satoshi text-lg text-white">{month} {year}</span>
                </div>
                <div className="bg-stone-600 p-2 rounded-lg">
                  <span className="text-sm text-white font-satoshi">{expense.description}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-satoshi  font-bold text-white">{month} {day}</span>
                <div className="bg-stone-500 p-2 rounded-lg">
                  <span className="text-sm text-white font-satoshi">You paid</span>
                  <span className="font-bold text-black text-lg ml-2 font-sans">₹{expense.amount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link to={`/group/${id}/addexpense`}>
        <button className='fixed bottom-20 right-5 text-black w-40 hover:border-4 hover:border-textColor font-satoshi bg-buttonColor font-bold gap-1 py-2 flex justify-center items-center rounded-full'>
          <ReceiptText className='text-black' />Add expense
        </button>
      </Link>

      <div className="flex justify-around w-full fixed bottom-0 bg-primaryColor p-2">
        <button className="flex flex-col justify-center items-center" onClick={() => navigate("/")}>
          <UsersRound className={`size-5 ${isActive('/')}`} />
          <span className={`flex justify-start text-base font-satoshi ${isActive('/')}`}>Groups</span>
        </button>
        <button className="flex flex-col justify-center items-center" onClick={() => navigate("/friends")}>
          <UserRound className={`size-5 ${isActive('/friends')}`} />
          <span className={`flex justify-start text-base font-satoshi ${isActive('/friends')}`}>Friends</span>
        </button>
        <button className="flex flex-col justify-center items-center" onClick={() => navigate("/accounts")}>
          <CircleUserRound className={`size-5 ${isActive('/accounts')}`} />
          <span className={`flex justify-start text-base font-satoshi ${isActive('/accounts')}`}>Account</span>
        </button>
      </div>
      {modals && <Modal setOpenModal={setModals} groupId={id} />}
    </div>
  );
};

export default GroupInfo;
