import React from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import CustomDropdown from "../../components/custom/customSelect";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { Divider } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

const Filter = ({
    handleFilterData,
    handleResetFilterData,
    advanceSearch,
    disabled,
    isNoFilterData,
    filterdData,
    isViewAdvanceSearch,
    handleResetOpenAdvanceSearch,
}) => {
    const [checked, setChecked] = React.useState(false);
    const [selectedField, setSelectedField] = React.useState(null);
    const [searchValue, setSearchValue] = React.useState("");
    const [isOpenAdvanceSearch, setOpenAdvanceSearch] = React.useState(false);
    const [selectedOperator, setSelectedOperator] = React.useState(null);
    const [selectedVeriable, setSelectedVeriable] = React.useState(null);
    const [advanceSearchValue, setAdvanceSearchValue] = React.useState("");
    const [isCaseSensitive, setIsCaseSensitive] = React.useState("");

    const handleChange = () => {
        setChecked((prev) => !prev);
    };

    const handleRestBacicSearch = () => {
        setSelectedField(null)
        setSearchValue('');
        handleResetFilterData();
        handleResetOpenAdvanceSearch();
    };

    const handleRestAdvanceSearch = () => {
        setSelectedOperator(null);
        setSelectedVeriable(null);
        setAdvanceSearchValue("");
        handleResetFilterData(null);
        setIsCaseSensitive(null);
    };

    const handleAdvanceSearch = () => {
        advanceSearch({
            selectedOperator: selectedOperator?.value,
            selectedVeriable: selectedVeriable?.value,
            advanceSearchValue: advanceSearchValue,
            isCaseSensitive: isCaseSensitive,
        });
    };

    React.useEffect(() => {
        if (isViewAdvanceSearch === false) {
            setOpenAdvanceSearch(!isOpenAdvanceSearch)
        };
    }, [isViewAdvanceSearch]);

    const handleFilter = () => {
        handleFilterData({
            selectedField: selectedField?.value,
            searchValue: searchValue
        });
    };

    const fieldsList = [
        { label: 'Loan ID', value: 'loan_id' },
        { label: 'Borrower Id', value: 'borrower_id' },
        { label: 'Partner Loan App Id', value: 'partner_loan_app_id' },
        { label: 'Customer Name', value: 'customer_name' },
        { label: 'Loan Amount', value: 'sanction_amount' },
        { label: 'Application Date', value: 'created_at' },
        { label: 'Status', value: 'status' },
    ];

    const advanaceSearchOperator = [
        { label: '>', value: '>' },
        { label: '<', value: '<' },
        { label: '>=', value: '>=' },
        { label: '<=', value: '<=' },
        { label: '=', value: '=' },
        { label: '!=', value: '!=' },
    ];

    const advanaceSearchOperatorOtherFields = [
        { label: '=', value: '=' },
        { label: '!=', value: '!=' },
    ];

    const advanaceSearchVeriables = [
        { label: 'Loan ID', value: 'loan_id' },
        { label: 'Borrower Id', value: 'borrower_id' },
        { label: 'Partner Loan App Id', value: 'partner_loan_app_id' },
        { label: 'Customer Name', value: 'customer_name' },
        { label: 'Loan Amount', value: 'sanction_amount' },
        { label: 'Date', value: 'created_at' },
        { label: 'Status', value: 'status' },
    ];

    const renderAdvanceSearch = () => (
        <div>
            <React.Fragment>
                <Dialog
                    fullWidth={true}
                    maxWidth={false}
                    open={isOpenAdvanceSearch}
                    onClose={() => setOpenAdvanceSearch(!isOpenAdvanceSearch)}
                >
                    <DialogTitle>Advance Search</DialogTitle>
                    {isNoFilterData === true && <h2
                        style={{
                            color: 'red',
                            textAlign: 'center'
                        }}>
                        No Records found for search criteria.
                        </h2>
                    }
                    <DialogContent>
                        <Divider />
                        <Grid sx={{
                            display: 'flex',
                            paddingTop: '40px',
                            paddingBottom: '30px',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <CustomDropdown
                                placeholder='Select Field'
                                data={advanaceSearchVeriables}
                                value={selectedVeriable}
                                id="Field"
                                width={200}
                                handleDropdownChange={(value) => {
                                    if (value) {
                                        setSelectedVeriable(value);
                                        setAdvanceSearchValue('');
                                        setSelectedOperator(null);
                                    } else {
                                        setSelectedOperator(null);
                                        setAdvanceSearchValue('');
                                        handleResetOpenAdvanceSearch();
                                    };
                                }}
                            />
                            <div
                                style={{ marginLeft: '10px' }}
                            >
                                <CustomDropdown
                                    placeholder='Select Operator'
                                    data={selectedVeriable?.value === 'sanction_amount' ||
                                        selectedVeriable?.value === 'created_at' ?
                                        advanaceSearchOperator : advanaceSearchOperatorOtherFields
                                    }
                                    value={selectedOperator}
                                    id="product"
                                    width={200}
                                    handleDropdownChange={(value) => {
                                        handleResetOpenAdvanceSearch();
                                        setSelectedOperator(value);
                                    }}
                                />
                            </div>
                            <div
                                style={{ marginLeft: '10px' }}
                            >
                                <TextField
                                    id="outlined-basic"
                                    label="Value"
                                    variant="outlined"
                                    value={advanceSearchValue}
                                    onChange={(e) => {
                                        setAdvanceSearchValue(e.target.value);
                                        handleResetOpenAdvanceSearch();
                                    }}
                                />
                            </div>
                            <div
                                style={{ marginLeft: '10px' }}
                            >
                                Case Sensitive ? <Checkbox
                                    checked={isCaseSensitive}
                                    onChange={(e) => setIsCaseSensitive(e.target.checked)}
                                    color='error'
                                />
                            </div>
                            <Button
                                sx={{ ml: 1 }}
                                variant="contained"
                                color='error'
                                size="md"
                                onClick={handleRestAdvanceSearch}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ ml: 2 }}
                                size="md"
                                onClick={handleAdvanceSearch}
                            >
                                Search
                            </Button>
                        </Grid>
                        <Divider />
                        <DialogActions>
                            <Button
                                variant="contained"
                                onClick={() => setOpenAdvanceSearch(!isOpenAdvanceSearch)}
                                color='error'
                            >Close</Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        </div >
    );

    const renderBasicFilter = () => (
        <div style={{ display: 'flex', padding: '0 10px 10px 0', marginLeft: '10px', marginBottom: '3px' }}>
            <CustomDropdown
                placeholder='Select Field'
                data={fieldsList}
                value={selectedField}
                id="product"
                width={200}
                handleDropdownChange={(value) => {
                    if (value) {
                        setSearchValue("")
                        setSelectedField(value)
                    }
                    if (!value) {
                        setSearchValue("")
                    }
                }}
            />
            <TextField
                id="outlined-basic"
                label="Type here...."
                variant="outlined"
                sx={{ ml: 2 }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
                variant="contained"
                sx={{ ml: 2 }}
                size="md"
                onClick={handleFilter}
            >
                Search
            </Button>
            <Button
                sx={{ ml: 1 }}
                variant="contained"
                color='error'
                size="md"
                onClick={handleRestBacicSearch}
            >
                Reset
            </Button>
            <Button
                sx={{ ml: 1 }}
                variant="contained"
                size="md"
                onClick={() => setOpenAdvanceSearch(!isOpenAdvanceSearch)}
            >
                Advance Search
            </Button>
        </div>
    );

    return (
        <div>
            {renderAdvanceSearch()}
            <div
                style={{ cursor: 'pointer', color: checked ? 'blue' : '' }}
                onClick={handleChange}
                disabled={disabled}
            >
                <FilterListIcon />  Filters
            </div>
            <div>
                <Box sx={{ display: 'flex' }}>
                    <Fade in={checked}>{renderBasicFilter()}</Fade>
                </Box>
            </div>
        </div>
    )
};

export default Filter;
