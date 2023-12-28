export const SectionData = {
    primary: {
      section_name:"Primary Applicant",
      section_sequence_no:"100",
      section_code:"primary",
      primary_pan: {
        sub_section_code:"primary_pan",
        sub_section_name:"Primary Pan Check",
        sub_section_sequence_no:1
      },
      primary_section_submit: {
        sub_section_code:"primary_section_submit",
        sub_section_name:"Primary Verify And Next",
        sub_section_sequence_no:2
      }
    },
    entity: {
        section_name:"Entity Details",
        section_sequence_no:"200",
        section_code:"entity",
        entity_section_submit: {
          sub_section_code:"entity_section_submit",
          sub_section_name:"Entity Verify And Next",
          sub_section_sequence_no:5
        }
      },
    
    co_borrower: {
        section_name:"Co-Borrower-",
        section_sequence_no:"300",
        section_code :"co_borrower",
        co_borrower_pan:{
          sub_section_code:"co_borrower_pan",
          sub_section_name:"Co-Borrower Check",
          sub_section_sequence_no:1

        },
        co_borrower_section_submit:{
          sub_section_code:"co_borrower_section_submit",
          sub_section_name:"Co-Borrower Verify And Next",
          sub_section_sequence_no:2
        }
    },
    guarantor:{
        section_name:"Guarantor",
        section_sequence_no:"400",
        section_code :"guarantor",
        guarantor_pan:{
          sub_section_code:"guarantor_pan",
          sub_section_name:"Guarantor Check",
          sub_section_sequence_no:1
        },
        guarantor_section_submit:{
          sub_section_code:"guarantor_section_submit",
          sub_section_name:"Guarantor Verify And Next",
          sub_section_sequence_no:2
        }
    },
    financial_docs: {
        section_name:"Financial Documen",
        section_sequence_no:"500",
        section_code:"financial_doc",
        financial_doc_gst:{
          sub_section_code:"financial_doc_gst",
          sub_section_name:"Financial Document GST Check",
          sub_section_sequence_no:1,
        },
        financial_doc_section_submit: {
          sub_section_code:"financial_doc_section_submit",
          sub_section_name:"Financial Doc Verify And Next",
          sub_section_sequence_no:2
        }
      },
    additional_docs: {
        section_name:"Additional Document",
        section_sequence_no:"600",
        section_code:"additional_doc",
        additional_doc_section_submit: {
          sub_section_code:"additional_doc_section_submit",
          sub_section_name:"Additional Document Section Submit",
          sub_section_sequence_no:1
        }
      },
      shareholding_pattern:{
        section_name:"Share holding details",
        section_sequence_no:"700",
        section_code:"share_holding",
        share_holding_section_submit: {
          sub_section_code:"share_holding_section_submit",
          sub_section_name:"Share holding Section Submit",
          sub_section_sequence_no:1
        }
      }

    
  };