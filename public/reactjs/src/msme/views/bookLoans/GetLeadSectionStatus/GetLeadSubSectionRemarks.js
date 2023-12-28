import { getLeadSectionStatusWatcher } from '../../../actions/status.action';

const getSubSectionRemarks = (loanAppID, user, company_id, product_id, section_code, sub_section_code, dispatch, both_status = false, section_sequence_no=null) => {
  const payload = {
    loanAppID: loanAppID,
    user: user,
    product_id: product_id,
    company_id: company_id,
  };
  return new Promise((resolve, reject) => {
    dispatch(getLeadSectionStatusWatcher(payload, resolve, reject));
  })
    .then((response) => {
      let statusPerSection = response;
      if(section_sequence_no){
        for (const section of statusPerSection) {
          if (section.section_sequence_no === section_sequence_no) {
              for (const subSection of section.subsections) {
              if (subSection.sub_section_code === sub_section_code) {
                return subSection.sub_section_remarks
              }
            }
          }
        }
      }else{
        for (const section of statusPerSection) {
          if (section.section_code === section_code) {
              for (const subSection of section.subsections) {
              if (subSection.sub_section_code === sub_section_code) {
                return subSection.sub_section_remarks
              }
            }
          }
        }
      }
      return null;
    })
    .catch((error) => {
      return null;
    });
};

export default getSubSectionRemarks;
