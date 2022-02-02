
import Header from './components/header'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Tasks from './components/Tasks'
import { useState, useEffect } from 'react'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'


const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    
    getTasks()
  }, [])
//Fetch Tasks
  const fetchTasks = async () => {
      const resp = await fetch('http://localhost:5000/tasks')//fetch returns a promise so we await the promise
      const data = await resp.json()

      return data
    }
    
    const fetchTask = async (id) => {
      const resp = await fetch(`http://localhost:5000/tasks/${id}`)//fetch returns a promise so we await the promise
      const data = await resp.json()

      return data
    }
    const addTask = async (task) => {
       const res = await fetch('http://localhost:5000/tasks/',{
         method: 'POST',
         headers: {
           'Content-type': 'application/json'
         },
         body: JSON.stringify(task)
       } )


       const data = await res.json()

       setTasks([...tasks, data])

      // const id = Math.floor(Math.random()* 10000) + 1
      // const newTask = { id, ...task }
      // setTasks([...tasks, newTask])
    }

    //delete task
    const deleteTask = async (id) => {
       await fetch(`http://localhost:5000/tasks/${id}`, {
         method: 'DELETE',
       })
       
       setTasks(tasks.filter((task) =>task.id !==id))// i dont want to show task with id,since all have id therefire it deletes
    }


    const toggleReminder = async (id) => {
       const taskToToggle = await fetchTask(id)
       const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
        
        const res = await fetch(`http://localhost:5000/task/${id}`, {
            method: 'PUT',
            headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(updTask),    
      })
      const data = await res.json()

      setTasks(
        tasks.map((task) => 
        task.id === id ? {...task, reminder:
      !task.reminder } : task
      )
      )
    }
  return (
    <Router>
    <div className="container">
     <Header onAdd ={()=> setShowAddTask(!showAddTask)}
     showAdd={showAddTask} />
     
     <Route path='/' exact render={(props) =>(

       <>
       {showAddTask && <AddTask onAdd={addTask}/>}
     {tasks.length > 0 ? (
     <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>) : (
       'No Tasks to Show'
     )}
     

       
       </>
     )}/>

     <Route path ='/about' component={About}/>
     <Footer />
    </div>
    </Router>
  );
}

export default App;





