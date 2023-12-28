import React, {useState} from "react";
import AgencyForm from "../form/form.view";
import { useDispatch } from "react-redux";
import { createCollectionAgencyWatcher } from "actions/collection/agency.action";
import { setObjectKeysToDefault } from "util/helper";
import { COLLECTION_AGENCY_FORM_FIELDS } from "../formFields.agencyForm";

const agencyDefault = setObjectKeysToDefault(COLLECTION_AGENCY_FORM_FIELDS);

export default function addAgency(props) {
  const dispatch = useDispatch();
  const [formAgency, setFormAgency] = useState(agencyDefault);

  const onSubmit = (payload) => {
    return new Promise((resolve, reject) => {
      dispatch(createCollectionAgencyWatcher(payload, resolve, reject));
    });
  };

  return (
    <React.Fragment>
      <AgencyForm
        {...props}
        onSubmit={onSubmit}
        formAgency={formAgency}
        submitButtonText="Create"
      />
    </React.Fragment>
  );
}
