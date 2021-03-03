import React, { useState } from 'react';
import { IUser } from '../../data/models/user-interface';
import { useAuth } from '../../hooks/auth-service';
import './Home.scss';

const Home: React.FC = (props) => {
  const [user, setUser] = useState<Nullable<IUser>>(null);
  const { getLoggedUser } = useAuth();
  const handleClick = async () => {
    try {
      const resutlt = await getLoggedUser();
      setUser(resutlt);
    } catch (err) {
      console.log(err);
    }
  };
  const resetUsers = () => {
    setUser(null);
  };
  return (
    <div className="container">
      <p>HOME PAGE</p>
      <ul className="list-group">{user && <li className="list-group-item">{user.email + ' -> ' + user.name}</li>}</ul>
      <button onClick={handleClick} className="btn btn-primary">
        Get more users
      </button>
      <button onClick={resetUsers} className="btn btn-danger">
        RESET
      </button>
    </div>
  );
};

export default Home;
