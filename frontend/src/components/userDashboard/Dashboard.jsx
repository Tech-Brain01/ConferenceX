import {useEffect , useState} from 'react';
import OverViewUserStats from "./dashboard_features/OverViewUserStats.jsx";
import FilterBar from '../FilterBar.jsx';
import { Tab } from './tabs.jsx';


const Dashboard = () => {
  const getDefaultFromDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const getDefaultToDate = new Date();

  const [filterDate, setFilterDate] = useState({
    fromDate: getDefaultFromDate,
    toDate: getDefaultToDate
  });

  const handleApplyFilter = (fromDate, toDate) => {
    setFilterDate({fromDate , toDate});
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6 font-sans'>
      <header className='mb-8'>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Overview
        </h1>
        <div className="mt-10 flex items-center justify-center">
         <FilterBar
            onApply={handleApplyFilter}
            initialFromDate={filterDate.fromDate}
            initialToDate={filterDate.toDate}
          />
        </div>
      </header>
       
       <section className='mb-12'>
          <OverViewUserStats filterDate={filterDate}/>
       </section>
        
        <section>
          <Tab/>
        </section>
      </div>
  )
}

export default Dashboard