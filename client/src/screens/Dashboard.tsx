import React, { useEffect, useState } from "react";
import { BsPlusLg } from 'react-icons/bs';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import './Dashboard.css'
import OverlaySpinner from "../components/OverlaySpinner";
import { MdEditDocument } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function Dashboard()
{
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedProject, setEditedProject] = useState<Project | null>(null);
    const [newProjectName, setNewProjectName] = useState("");
    const navigate = useNavigate();
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number, clickedProject: string} | null>(null);

    const getProjects = async () => {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/projects`);
        setProjects(response.data.data);
        setLoading(false);
    }

    const navigateProject = (id : String) => {
        navigate(`/projects/${id}`);
    }

    const createNewProject = async () => {
        setLoading(true);
        if (newProjectName === "") {
            setNewProjectName("Untitled");
        }
        const response = await axios.post(`${BASE_URL}/projects`, { name: newProjectName });
        setLoading(false);
        navigateProject(response.data.data._id);
    }

    const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onEdit, onDelete }) => {
        const handleEdit = () => {
          onEdit();
          onClose();
        };
      
        const handleDelete = () => {
          onDelete();
          onClose();
        };
      
        return (
          <div className="menu"
            style={{
              position: 'absolute',
              top: y,
              left: x,
              display: 'flex',
              flexFlow: 'column nowrap',
              padding: '10px 0px',
              backgroundColor: '#fff',
              borderRadius: '10px',
              boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 15px',
              zIndex: 9999,
            }}
          >
            <div className="context-button" onClick={handleEdit}> <MdEditDocument className="icon"/> Rename</div>
            <div className="context-button" id="trash" onClick={handleDelete}> <FaTrashAlt className="icon" /> Delete </div>
          </div>
        );
    };

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>, clickedProject: string) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, clickedProject });
    };

    const handleCloseContextMenu = () => {
    setContextMenu(null);
    };

    const handleEdit = (project: Project) => {
        setEditMode(true);
        setEditedProject(project);
        setOpen(true);
      };
    
      const handleSaveEdit = async () => {
          setLoading(true);
          await axios.put(`${BASE_URL}/projects/${editedProject?._id}`, { name: newProjectName });
          getProjects();
          setEditMode(false);
          setEditedProject(null);
          setNewProjectName("");
          setOpen(false);
          setLoading(false);
      };
    
      const handleCancelEdit = () => {
        setEditMode(false);
        setEditedProject(null);
        setNewProjectName("");
        setOpen(false);
      };

    const handleDelete = async () => {
        setLoading(true);
        const response = await axios.delete(`${BASE_URL}/projects/${contextMenu?.clickedProject}`);
        getProjects();
        setLoading(false);
    };

    const handleContainerClick = () => {
        setContextMenu(null);
    };

    useEffect(() => {
        getProjects();
    }, []);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'white',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
        <div onClick={handleContainerClick} id="parent-click">
        {contextMenu && (
            <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={handleCloseContextMenu}
            onEdit={() => handleEdit(projects.find(p => p._id === contextMenu?.clickedProject) as Project)}
            onDelete={handleDelete}
            />
        )}
        <div className="gallery">
            <div className="project-box">
            <button className="project-image-link" onClick={()=>setOpen(true)}>
                <div id="plus-image">
                    <div className="plus-icon"> <BsPlusLg> </BsPlusLg> </div>
                </div>
                <div className="project-title"> <p> Create New </p></div>
            </button>

            <Modal open={open} onClose={()=>handleCancelEdit()}>
                <Box sx={style}>
                    {editMode}
                    <Typography sx={{pb:2}} variant="h6" component="h2">
                        {editMode ? "Rename Project" : "New Project"}
                    </Typography>
                    {editMode ? (
                  <>
                    <TextField
                      sx={{ pb: 2 }}
                      variant="outlined"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                    />
                    <Button onClick={handleSaveEdit}>Save</Button>
                  </>
                ) : (
                  <>
                    <TextField
                      sx={{ pb: 2 }}
                      variant="outlined"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                    />
                    <Button onClick={createNewProject}>Create</Button>
                  </>
                )}
                </Box>
            </Modal>

            </div>
            {
                projects.map((project : Project) => {
                    if (project._id) {
                        return (
                            <div key={String(project._id)} className="project-box">
                            <div onContextMenu={(e) => handleContextMenu(e, project._id)}>
                            <button className="project-image-link" onClick={() => navigateProject(project._id)}>
                                <div className="project-image">
                                    {project.designs.length >= 4 ? (
                                        <> 
                                            <img src={project.designs[project.designs.length-1].imageUrl} alt="Design 1" width={100} height={100}/>
                                            <img src={project.designs[project.designs.length-2].imageUrl} alt="Design 2" width={100} height={100}/>
                                            <img src={project.designs[project.designs.length-3].imageUrl} alt="Design 3" width={100} height={100}/>
                                            <img src={project.designs[project.designs.length-4].imageUrl} alt="Design 4" width={100} height={100}/>
                                        </>
                                        ) : <></>
                                        }
                                    {project.designs.length > 0 && project.designs.length < 4 ? (
                                        <img src={project.designs[project.designs.length-1].imageUrl} alt="Design 1" width={200} height={200} />
                                    ) : <></>}
                                </div>
                                <div className="project-title"> <p> {project.name ? project.name : "Untitled"} </p></div>
                            </button>
                            </div>
                            </div>
                        )
                    }
                    return <></>
                })
            }
        </div>
        </div>
        {loading && <OverlaySpinner />}
        </>
    );
}