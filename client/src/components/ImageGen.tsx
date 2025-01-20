import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, TextField, Collapse, Slider, LinearProgress, Typography, Divider, List, ListItem, CardHeader } from '@mui/material';
import axios from "axios";
import OverlaySpinner from '../components/OverlaySpinner';
import './metrics.css'

// @ts-ignore
import { Container } from '@nlpjs/core';
// @ts-ignore
import { SentimentAnalyzer } from '@nlpjs/sentiment'
// @ts-ignore
import { LangEn } from '@nlpjs/lang-en';
import keyword_extractor from "keyword-extractor";
// import { SentenceAnalyzer, PorterStemmer, SentimentAnalyzer } from 'natural';

// const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

interface Props {
    project: Project;
    design?: Design;
    onDesignUpdate: (updatedDesign: Design) => void;
}

function FeedbackBar({ title, description, value, color }: { title: string, description?: string, value: number, color?: "secondary" | "primary" | "error" | "info" | "success" | "warning" }) {
    return (
        <Box display='flex' flexDirection='column' flex={1} height='100%'>
            <Box width='100%' alignItems='center'>
                <h4>{title}</h4>
            </Box>
            <LinearProgress variant="determinate" color={color} value={value * 100} />
            <Box>
                <p>{description}</p>
            </Box>
        </Box>
    );
}

function KeywordBar({numwords}: {numwords:number}) {
    return (
        <div>
            <h3>Keywords</h3>
            <progress className='keyword' value={numwords} max="20"></progress>
        </div>
    );
}

function ClarityBar({clarity}: {clarity:number}) {
    return (
        <div>
            <h3>Clarity</h3>
            <progress className='clarity' value={clarity} max="100"></progress>
        </div>
    );
}

function CreativityBar({creativity}: {creativity:number}) {
    return (
        <div>
            <h3>Creativity</h3>
            <progress className='creativity' value={creativity} max="100"></progress>
        </div>
    );
}




export default function ImageGeneration(props: Props)
{
    const { project } = props;

    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [design, setDesign] = useState<Design>();
    const [showExample, setShowExample] = useState(false);

    const [nlpResult, setNlpResult] = useState({
        keywords: 0,
        saScore: 0,
        wordSentenceScore: 0,
    });
    const handle = useRef<number>();


    const generateImage = async () => {
        if (prompt.length < 1)
            return;
        setLoading(true);
        const response = await axios.post(`${BASE_URL}/designs`, { prompt, projectId: project._id });
        setDesign(response.data.data);
        props.onDesignUpdate(response.data.data);
        setLoading(false);
    }

    const performNLP = async (text: string) => {
        const extraction_result = keyword_extractor.extract(text, {
            language:"english",
            return_changed_case: true,
            remove_duplicates: true
        });
        const keywords = extraction_result.length;

        let saScore = 0;
        if (keywords > 2)
        {
            const container = new Container();
            container.use(LangEn);
            const sentiment = new SentimentAnalyzer({ container });
            const sa = (await sentiment.process({ locale: 'en', text })).sentiment;
            console.log(sa);
            const result = sa.score;
            // saScore = (2 - Math.min(Math.abs(result), 2)) / 2;
            saScore = Math.min(2, Math.max(0, result)) / 2;
        }

        const wordCount = text.split(" ").length;
        const sentenceCount = text.split(".").length;
        console.log('WS', wordCount, sentenceCount);


        setNlpResult({
            keywords: Math.min(keywords, 20) / 20,
            saScore,
            wordSentenceScore: Math.min(Math.max(0, Math.abs(wordCount / sentenceCount)), 7) / 7
        });
    }

    useEffect(() => {
        if (props.design) {
            setDesign(props.design);
            setPrompt(props.design.prompt);
        }
    }, [props.design]);

    useEffect(() => {
        if (prompt)
        {
            if (handle.current)
                clearTimeout(handle.current);

            handle.current = setTimeout(() => {
                performNLP(prompt);
            }, 500);
        }
        else
        {
            setNlpResult({ keywords: 0, saScore: 0, wordSentenceScore: 0 });
        }
        return () => {
            if (handle.current)
                clearTimeout(handle.current);
        }
    }, [prompt]);

    return (
        <Box flex={1} py={0} alignItems='center' >
            <Box maxWidth={1000}>

                <Box mt={5}>
                <Card>
                    <CardContent>
                        <Box pb={5}>
                            <Typography>
                                <Typography variant='h5'>Instructions:</Typography>
                                <Divider sx={{ mb: 2 }} />
                                The text box below will allow you to send a prompt to an AI that will help you generate this image. The text you provide can be in the form of
                                keywords or full sentence descriptions of the image you want.
                            </Typography>
                        </Box>
                        <CardMedia
                            component='img'
                            width={512} height={512}
                            src={design?.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/crowd-design.appspot.com/o/Poster2.png?alt=media&token=b2daffba-7455-4796-91a0-6889589a4ff9'}
                            sx={{ objectFit: 'contain' }}
                        />

                        <Box>
                        <Box mt={3}>
                            <Button onClick={()=>setShowExample(e => !e)}>{!showExample ? 'Show' : 'Hide'} example</Button>
                            <Collapse in={showExample}>
                                <Typography>You can use the following format to formulate your ideas:</Typography>
                                <Typography><b>The Concept (Main idea)</b>: Create an image that embodies the power and intelligence of AI.</Typography>
                                <Typography><b>Visualize what you want see</b>: Show us a futuristic world where machines seamlessly interact with humans, enhancing our capabilities and making our lives easier.</Typography>
                                <Typography><b>Describe the Outlook and Color Scheme</b>: Use vibrant colors, geometric shapes, and sleek designs to capture the essence of this cutting-edge technology.</Typography>
                            </Collapse>
                        </Box>
                        </Box>

                        <Box display='flex' flexDirection='column' mt={3} minHeight={200}>
                            <TextField multiline={true} minRows={3} sx={{ width: '100%' }} value={prompt} label="Text prompt" onChange={e => setPrompt(e.target.value)} />
                            <div className='metric-tab'>
                                {/* <KeywordBar numwords={numwords}/>
                                <ClarityBar clarity={clarity}/>
                                <CreativityBar creativity={creativity}/> */}
                                <FeedbackBar title="Keywords" value={nlpResult.keywords} color="primary"
                                    description="A keyword count of around 20 is ideal for image geneartion"
                                />
                                <FeedbackBar title="Clarity" value={nlpResult.wordSentenceScore} color="secondary"
                                    description="Creating simple sentences makes it easy to prompt engineer and iterate"
                                />
                                <FeedbackBar title="Sentiment Analysis" value={nlpResult.saScore} color="success"
                                    description="A positive sentiment analysis score might facilitate better image generation"
                                />
                            </div>
                            <Button sx={{ width: '100%', mt: 3 }} variant="contained" onClick={generateImage}>Generate</Button>
                        </Box>


                    </CardContent>
                </Card>
            </Box>

            {loading && <OverlaySpinner />}

        </Box>
    </Box>
    );
}