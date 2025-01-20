import React, { useEffect, useState } from "react";
import ImageGeneration from "../components/ImageGen";
import axios from "axios";
import { useParams } from "react-router-dom";
import OverlaySpinner from "../components/OverlaySpinner";
import './Project.css'
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, timelineItemClasses, TimelineOppositeContent, timelineOppositeContentClasses } from '@mui/lab'
import { TextField, Button, Avatar, Box } from '@mui/material';

export default function Project()
{
    const [project, setProject] = useState<Project>();
	const [design, setDesign] = useState<Design>();
    const { projectId } = useParams();
    const [projectName, setProjectName] = useState<String>(project ? project.name : "");
    const [isSelected, setIsSelected] = useState<String | null>(null);

    const getProject = async () => {
        const response = await axios.get(`${BASE_URL}/projects/${projectId}`);
		const p = response.data.data;
        setProject(p);
        setProjectName(p.name !== "" ? p.name : "Untitled");
		if (p.designs.length) {
			setActive(p.designs[p.designs.length - 1]);
		}
    }

    const changeProjectName = async (new_name : String) => {
		if (new_name !== "Untitled") {
			const response = await axios.put(`${BASE_URL}/projects/${projectId}`, {name: new_name});
		}
    }

    const setActive = async (design: Design) => {
		setIsSelected(design._id);
		setDesign(design);
    }

	const updateDesign = (updatedDesign: Design) => {
		getProject();
		setActive(updatedDesign);
	  };

    useEffect(() => {
        getProject();
    }, []);

    if (!project)
        return <OverlaySpinner />;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', pb: 5 }}>
		<Box sx={{ display: 'flex', flex: 2, maxWidth: 400 }}>
			<Box sx={{ width: '100%', px: 5,}}>
				<TextField className="project-name"
					variant="standard" value={projectName}
					onChange={e => setProjectName(e.target.value)}
					onBlur={e => changeProjectName(e.target.value)}
					inputProps={{style: {fontSize: 24}}}
				/>
			</Box>
			<Box>
				<Timeline>
				{project.designs.map((design, index) => (
						<TimelineItem>
							<TimelineOppositeContent>
								<Avatar src={design.imageUrl} sx={{ width: 108, height: 108 }} />
							</TimelineOppositeContent>
							<TimelineSeparator sx={{ transform: 'translateY(42px)' }}>
								<TimelineDot />
								{index != project.designs.length - 1 && <TimelineConnector />}
							</TimelineSeparator>
							<TimelineContent>
								<Button variant="text"
									sx={{
										width: 200,
										p: 1, borderRadius: 3,
										textTransform: 'none',
										fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit',
										backgroundColor: isSelected === design._id ? '#e3f2fd' : '#f3f2fd',
									}}
									onClick={() => setActive(design)}
								>
									{design.prompt}
								</Button>
							</TimelineContent>
						</TimelineItem>
				))}
				</Timeline>
			</Box>
        </Box>
		<Box sx={{ width: 50, mt: 5, borderRight: 2, borderColor: 'rgba(100,100,100,0.2)' }}></Box>
		<Box sx={{ display: 'flex', flex: 3 }}>
			<ImageGeneration project={project} design={design} onDesignUpdate={updateDesign}/>
		</Box>
        </Box>
    );
}