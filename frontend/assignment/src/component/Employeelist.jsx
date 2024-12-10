import { useEffect,  useState } from 'react'
import './employee.css'
import axios from 'axios'

const Employeelist = () => {

    let filters = [
        {value:'name',label:'name'},
        {value:'email',label:'email'},
        {value:'mobno',label:'mobno'},
        {value:'branch',label:'branch'}
    ]

    let [data,setdata] = useState([])
    let [search,setSearch] = useState('')
    let [sortby,setSortby] = useState('name')
    let [sortdirection,setSortDirection] = useState("ASC")
    const [selectedFilters, setSelectedFilters] = useState([])

    const handleCheckboxChange = (event) => {
        
        // console.log(event)
        const { value, checked } = event.target;
        // console.log(value)
        // console.log(checked)
        if (checked) {
          setSelectedFilters([...selectedFilters, value]);
        //   console.log(selectedFilters,value)
        } else {
          setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
        }
      };

    useEffect(()=>{
        let getdata = async ()=>{
            let res = await axios.get(`http://localhost:5000/api/employees?q=${search}&sortBy=${sortby}&sortDirection=${sortdirection}&filters=${selectedFilters.join(',')}`)
            setdata(res.data.payload)
        }
        getdata()

    },[search,sortby,sortdirection,selectedFilters])



  return (
    <>
        <div className="employee">
            <h1>Employee List</h1>
            <div className="filters">
            <div>
                <input type="search" placeholder='search' value={search} onChange={(e)=>setSearch(e.target.value)} />
            </div>
            <div className="sortby">
                <select name="sortby" id="" value={sortby} onChange={(e)=>setSortby(e.target.value)}>
                    <option value="name">name</option>
                    <option value="mobno">mobileno</option>
                    <option value="email">email</option>
                </select>
            </div>
            <div className="sortdirection">
                <select name="sortdirection" id="" value={sortdirection} onChange={(e)=>setSortDirection(e.target.value)}>
                    <option value="ASC" >ascending</option>
                    <option value="DESC" >descending</option>
                </select>
            </div>
            <div className="filter">
                {filters.map((filter)=>{
                    return(
                        <>
                        <label htmlFor={filter.label}>{filter.label}</label>
                        <input type="checkbox" name={filter.value} id="" value={filter.value} checked={selectedFilters.includes(filter.value)}
                          onChange={handleCheckboxChange} />
                        </>
                    )
                })}
            </div>
            </div>
            <div className="card">
                {
                    data.map((elem)=>{
                        let {imgurl,name,mobno,email,branch,address} = elem
                        return(
                            <>
                            <ul>
                                <li><img src={imgurl} alt="" /></li>
                                <li>{name}</li>
                                <li>{email}</li>
                                <li>{mobno}</li>
                                <li>{branch}</li>
                                <li>{address}</li>
                            </ul>
                            </>
                        )
                    })
                }
            </div>
        </div>
    </>
  )
}

export default Employeelist