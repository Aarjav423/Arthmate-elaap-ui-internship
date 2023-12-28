import React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { Divider, Typography, Button } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { TextareaAutosize } from '@mui/base';

const DisbursementRequestPopUp = ({
    isOpen,
    setIsOpen,
    failRows,
    totalRequest,
    successRows,
    errorRowsText,
    isProgressStart,
    isProgressStop,
    successRowsText,
    title,
}) => {
    const [progress, setProgress] = React.useState(0);
    const [buffer, setBuffer] = React.useState(10);
    const progressRef = React.useRef(() => { });

    React.useEffect(() => {
        progressRef.current = () => {
            if (progress > 100) {
                setProgress(0);
                setBuffer(10);
            } else {
                const diff = Math.random() * 10;
                const diff2 = Math.random() * 10;
                setProgress(progress + diff);
                setBuffer(progress + diff + diff2);
            }
        };
    });

    React.useEffect(() => {
        const timer = setInterval(() => {
            progressRef.current();
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div>
            <React.Fragment>
                <Dialog
                    fullWidth={true}
                    maxWidth={false}
                    open={isOpen}
                    onClose={() => setIsOpen()}
                >
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <Divider />
                        <Grid sx={{
                            ml: 5,
                            mt: 2,
                        }}>
                            <Grid className='d-flex'>
                                <Grid xs={3}>
                                    <Typography variant="h6">Total disbursement request</Typography>
                                </Grid>
                                <Grid xs={1}>
                                    <Typography variant="h6">{totalRequest?.length}</Typography>
                                </Grid>
                            </Grid>
                            <Grid className='d-flex'>
                                <Grid xs={3}>
                                    <Typography variant="h6">Successful requests</Typography>
                                </Grid>
                                <Grid xs={1}>
                                    <Typography variant="h6">{successRows?.length}</Typography>
                                </Grid>
                            </Grid>
                            <Grid className='d-flex'>
                                <Grid xs={3}>
                                    <Typography variant="h6">Failed requests</Typography>
                                </Grid>
                                <Grid xs={1}>
                                    <Typography variant="h6">{failRows?.length}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                      {successRows?.length && successRowsText ? <Grid sx={{
                          ml: 5,
                          mr: 5,
                          mt: 3,
                          mb: 3,
                        }}>
                          <TextareaAutosize
                            aria-label="textarea"
                            placeholder="Success requests"
                            style={{ width: '100%' }}
                            value={successRowsText}
                          />
                        </Grid>
                        : null
                      }
                        {failRows?.length && errorRowsText ? <Grid sx={{
                            ml: 5,
                            mr: 5,
                            mt: 3,
                            mb: 3,
                        }}>
                            <TextareaAutosize
                                aria-label="textarea"
                                placeholder="Failed requests"
                                style={{ width: '100%' }}
                                value={errorRowsText}
                            />
                         </Grid>
                          : null
                        }
                        {isProgressStart && <Grid sx={{
                            display: 'flex',
                            paddingTop: '10px',
                            paddingBottom: '10px',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Box sx={{
                                width: '100%',
                                mt: 3,
                                ml: 5,
                                mr: 5,
                            }}>
                                <Typography variant="h6">Progress</Typography>
                                <LinearProgress
                                    variant="buffer"
                                    value={progress}
                                    valueBuffer={buffer} />
                            </Box>
                        </Grid>}
                        <Divider />
                        <DialogActions>
                            <Button
                                variant="contained"
                                onClick={() => setIsOpen()}
                                color='error'
                                disabled={!isProgressStop}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        </div >
    )
};

export default DisbursementRequestPopUp;
