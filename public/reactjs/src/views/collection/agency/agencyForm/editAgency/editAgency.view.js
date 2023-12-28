import React, { useEffect, useState } from 'react'
import AgencyForm from '../form/form.view'
import { useDispatch, useSelector } from 'react-redux'
import { updateCollectionAgencyWatcher } from 'actions/collection/agency.action';
import { setObjectKeysToDefault } from 'util/helper';
import { COLLECTION_AGENCY_FORM_FIELDS } from '../formFields.agencyForm';
import { storedList } from 'util/localstorage';

const formAgencyDefault = setObjectKeysToDefault(COLLECTION_AGENCY_FORM_FIELDS)
const user = storedList('user');

export default function editAgency(props) {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [formAgency, setFormAgency] = useState(formAgencyDefault);

    const collectionAgency = Object.values(store["fos"]["collectionAgency"])
    useEffect(() => {
        fetchAgencyById(props.selectedAgency);
    }, [props.selectedAgency]);

    const fetchAgencyById = (selectedAgency) => {
        setFormAgency(store["fos"]["collectionAgency"][selectedAgency._id])
    }

    const onSubmit = (payload) => {
        return new Promise((resolve, reject) => {
            dispatch(updateCollectionAgencyWatcher({ ...payload, agencyId: props.selectedAgency._id }, resolve, reject))
        })
    }
    return (
        <React.Fragment>
            <AgencyForm
                {...props}
                key={formAgency.name}
                onSubmit={onSubmit}
                formAgency={formAgency}
                submitButtonText="Update & Save"
                type='edit'
            />
        </React.Fragment>
    )
}
