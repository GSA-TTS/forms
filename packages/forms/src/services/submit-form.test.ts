import { describe, expect, it } from 'vitest';

import {
  addDocument,
  createForm,
  createFormSession,
  defaultFormConfig,
  BlueprintBuilder,
  type Blueprint,
  type InputPattern,
  type PagePattern,
  type PageSetPattern,
  type PatternValueMap,
} from '../index.js';
import { createTestFormServiceContext } from '../testing.js';
import { loadSamplePDF } from '../documents/__tests__/sample-data.js';
import { submitForm } from './submit-form.js';
import { object } from 'zod';

describe('submitForm', () => {
  it('succeeds with empty form', async () => {
    const { ctx, id, form } = await setupTestForm();
    const session = createFormSession(form);
    const formSessionResult = await ctx.repository.upsertFormSession({
      formId: id,
      data: session,
    });
    if (!formSessionResult.success) {
      expect.fail('upsertFormSession failed');
    }

    const result = await submitForm(ctx, formSessionResult.data.id, id, {});
    expect(result).toEqual({
      success: true,
      data: {
        session: session,
        sessionId: formSessionResult.data.id,
        documents: [],
      },
    });
  });

  it('fails with invalid form ID', async () => {
    const { ctx, form, id } = await setupTestForm();
    const session = createFormSession(form);
    const formSessionResult = await ctx.repository.upsertFormSession({
      formId: id,
      data: session,
    });
    if (!formSessionResult.success) {
      expect.fail('upsertFormSession failed');
    }
    const result = await submitForm(
      ctx,
      formSessionResult.data.id,
      'invalid-id',
      {}
    );
    expect(result).toEqual({
      success: false,
      error: 'Form not found',
    });
  });

  it('succeeds with incomplete session', async () => {
    const { ctx, form, id } = await setupTestForm(createOnePatternTestForm());
    const session = createFormSession(form);
    const formSessionResult = await ctx.repository.upsertFormSession({
      formId: id,
      data: session,
    });
    if (!formSessionResult.success) {
      expect.fail('upsertFormSession failed');
    }
    const result = await submitForm(ctx, formSessionResult.data.id, id, {});
    expect(result).toEqual({
      data: {
        sessionId: formSessionResult.data.id,
        session: {
          ...session,
          route: undefined,
        },
      },
      success: true,
    });
  });

  it('succeeds with complete session', async () => {
    const { ctx, form, id } = await setupTestForm(createOnePatternTestForm());
    const session = createFormSession(form);
    const formSessionResult = await ctx.repository.upsertFormSession({
      formId: id,
      data: session,
    });
    if (!formSessionResult.success) {
      expect.fail('upsertFormSession failed');
    }
    const result = await submitForm(ctx, formSessionResult.data.id, id, {
      'element-1': 'test',
    });
    expect(result).toEqual({
      success: true,
      data: {
        session: expect.any(Object),
        sessionId: formSessionResult.data.id,
        documents: [],
      },
    });
  });

  it('returns a pdf with completed form', async () => {
    const { ctx, form, id } = await setupTestForm(
      await createTestFormWithPDF()
    );
    const formData = getMockFormData(form);
    const formSessionResult = await ctx.repository.upsertFormSession({
      formId: id,
      data: createFormSession(form),
    });
    if (!formSessionResult.success) {
      expect.fail('upsertFormSession failed');
    }
    const result = await submitForm(
      ctx,
      formSessionResult.data.id,
      id,
      formData
    );
    expect(result).toEqual(
      expect.objectContaining({
        success: true,
        data: {
          session: expect.any(Object),
          sessionId: formSessionResult.data.id,
          documents: [
            {
              fileName: 'test.pdf',
              data: expect.any(Uint8Array),
            },
          ],
        },
      })
    );
  });

  it.fails('handles page one of a multi-page form', async () => {
    const form = createForm(
      {
        title: 'Test form',
        description: 'Test description',
      },
      {
        root: 'root',
        patterns: [
          {
            type: 'page-set',
            id: 'root',
            data: {
              pages: ['page-1', 'page-2'],
            },
          } satisfies PageSetPattern,
          {
            type: 'page',
            id: 'page-1',
            data: {
              title: 'Page 1',
              patterns: ['element-1'],
            },
          } satisfies PagePattern,
          {
            type: 'input',
            id: 'element-1',
            data: {
              label: 'Pattern 1',
              initial: '',
              required: true,
              maxLength: 128,
            },
          } satisfies InputPattern,
          {
            type: 'page',
            id: 'page-2',
            data: {
              title: 'Page 2',
              patterns: ['element-2'],
            },
          } satisfies PagePattern,
          {
            type: 'input',
            id: 'element-2',
            data: {
              label: 'Pattern 2',
              initial: '',
              required: true,
              maxLength: 128,
            },
          } satisfies InputPattern,
        ],
      }
    );
    const { ctx, id } = await setupTestForm(form);
    const formSessionResult = await ctx.repository.upsertFormSession({
      formId: id,
      data: createFormSession(form),
    });
    if (!formSessionResult.success) {
      expect.fail('upsertFormSession failed');
    }
    const result = await submitForm(ctx, formSessionResult.data.id, id, {
      'element-1': 'test',
    });
    expect(result).toEqual({
      success: true,
      data: { documents: [] },
    });
  });
});

const setupTestForm = async (form?: Blueprint) => {
  form = form || createForm({ title: 'test', description: 'description' });
  const ctx = await createTestFormServiceContext({
    isUserLoggedIn: () => false,
  });
  const addFormResult = await ctx.repository.addForm(form);
  if (addFormResult.success === false) {
    expect.fail('addForm failed');
  }
  return { ctx, id: addFormResult.data.id, form };
};

const createOnePatternTestForm = () => {
  return createForm(
    {
      title: 'Test form',
      description: 'Test description',
    },
    {
      root: 'root',
      patterns: [
        {
          type: 'page-set',
          id: 'root',
          data: {
            pages: ['page-1'],
          },
        } satisfies PageSetPattern,
        {
          type: 'page',
          id: 'page-1',
          data: {
            title: 'Page 1',
            patterns: ['element-1', 'element-2'],
          },
        } satisfies PagePattern,
        {
          type: 'input',
          id: 'element-1',
          data: {
            label: 'Pattern 1',
            initial: '',
            required: true,
            maxLength: 128,
          },
        } satisfies InputPattern,
      ],
    }
  );
};

const createTestFormWithPDF = async () => {
  const pdfBytes = await loadSamplePDF(
    'doj-pardon-marijuana/application_for_certificate_of_pardon_for_simple_marijuana_possession.pdf'
  );
  const builder = new BlueprintBuilder(defaultFormConfig);
  const { updatedForm } = await addDocument(
    builder.form,
    {
      name: 'test.pdf',
      data: new Uint8Array(pdfBytes),
    },
    {
      fetchPdfApiResponse: async () => SERVICE_RESPONSE,
    }
  );

  return updatedForm;
};

const getMockFormData = (form: Blueprint): PatternValueMap => {
  return Object.keys(form.patterns).reduce((acc, key) => {
    if (form.patterns[key].type === 'checkbox') {
      acc[key] = true;
    } else {
      acc[key] = 'test value';
    }
    return acc;
  }, {} as PatternValueMap);
};

const SERVICE_RESPONSE = {
  message: 'PDF parsed successfully',
  parsed_pdf: {
    raw_text:
      'OMB Control No: 1123-0014 Expires 03/31/2027 \nAPPLICATION FOR CERTIFICATE OF PARDON FOR THE OFFENSES OF \nSIMPLE POSSESSION, ATTEMPTED SIMPLE POSSESSION, OR USE OF \nMARIJUANA \nOn October 6, 2022, President Biden issued a presidential proclamation that pardoned many federal and D.C. \noffenses for simple marijuana possession. On December 22, 2023, President Biden issued another proclamation that \nexpanded the relief provided by the original proclamation by pardoning the federal offenses of simple possession, \nattempted possession, and use of marijuana. \nHow a pardon can help you \nA pardon is an expression of the President\u2019s forgiveness. It does not mean you are innocent or expunge your \nconviction. But it does remove civil disabilities\u2014such as restrictions on the right to vote, to hold office, or to sit \non a jury\u2014that are imposed because of the pardoned conviction. It may also be helpful in obtaining licenses, \nbonding, or employment. Learn more about the pardon. \nYou qualify for the pardon if: \n\u2022 On or before December 22, 2023, you were charged with or convicted of simple possession, attempted \npossession, or use of marijuana under the federal code, the District of Columbia code, or the Code of \nFederal Regulations \n\u2022 You were a U.S. citizen or lawfully present in the United States at the time of the offense \n\u2022 You were a U.S. citizen or lawful permanent resident on December 22, 2023 \nRequest a certificate to show proof of the pardon \nA Certificate of Pardon is proof that you were pardoned under the proclamation. The certificate is the only \ndocumentation you will receive of the pardon. Use the application below to start your request. \nWhat you\'ll need for the request \nAbout you \nYou can submit a request for yourself or someone else can submit on your behalf. You must provide \npersonal details, like name or citizenship status and either a mailing address, an email address or both to \ncontact you. We strongly recommend including an email address, if available, as we may not be able to \nrespond as quickly if you do not provide it. You can also use the mailing address or email address of \nanother person, if you do not have your own. \nAbout the charge or conviction \nYou must state whether it was a charge or conviction, the court district where it happened, and the date \n(month, day, year). If possible, you should also: \n\u2022 enter information about your case (docket or case number and the code section that was \ncharged) \n\u2022 upload your documents \no charging documents, like the indictment, complaint, criminal information, ticket or \ncitation; or \no conviction documents, like the judgment of conviction, the court docket sheet showing \nthe sentence and date it was imposed, or if you did not go to court, the receipt showing \npayment of fine \nIf you were charged by a ticket or citation and paid a fine instead of appearing in court, you should also provide the \ndate of conviction or the date the fine was paid. \nWithout this information, we can\'t guarantee that we\'ll be able to determine if you qualify for the pardon under \nthe proclamation. \n \nPage 1 of 4 \nUnited States Department of Justice Office of the Pardon Attorney Washington, D.C. 20530 January 2024 OMB Control No: 1123-0014 Expires 03/31/2027 \nAPPLICATION FOR CERTIFICATE OF PARDON FOR THE OFFENSES OF \nSIMPLE POSSESSION, ATTEMPTED SIMPLE POSSESSION, OR USE OF \nMARIJUANA \nInstructions: \nAn online version of this application is available at: Presidential Proclamation on Marijuana Possession \n(justice.gov). You can also complete and return this application with the required documents to \nUSPardon.Attorney@usdoj.gov or U.S. Department of Justice, Office of the Pardon Attorney, 950 Pennsylvania \nAvenue NW, Washington, DC 20530. \nPublic Burden Statement: \nThis collection meets the requirements of 44 U.S.C. \u00a7 3507, as amended by the Paperwork Reduction Act of 1995. \nWe estimate that it will take 120 minutes to read the instructions, gather the relevant materials, and answer \nquestions on the form. Send comments regarding the burden estimate or any other aspect of this collection of \ninformation, including suggestions for reducing this burden, to Office of the Pardon Attorney, U.S. Department of \nJustice, Attn: OMB Number 1123-0014, RFK Building, 950 Pennsylvania Avenue, N.W., Washington DC 20530. \nThe OMB Clearance number, 1123-0014, is currently valid. \nPrivacy Act Statement: \nThe Office of the Pardon Attorney has authority to collect this information under the U.S. Constitution, Article \nII, Section 2 (the pardon clause); Orders of the Attorney General Nos. 1798-93, 58 Fed. Reg. 53658 and 53659 \n(1993), 2317-2000, 65 Fed. Reg. 48381 (2000), and 2323-2000, 65 Fed. Reg. 58223 and 58224 (2000), codified in \n28 C.F.R. \u00a7\u00a7 1.1 et seq. (the rules governing petitions for executive clemency); and Order of the Attorney General \nNo. 1012-83, 48 Fed. Reg. 22290 (1983), as codified in 28 C.F.R. \u00a7\u00a7 0.35 and 0.36 (the authority of the Office of \nthe Pardon Attorney). The principal purpose for collecting this information is to enable the Office of the Pardon \nAttorney to issue an individual certificate of pardon to you. The routine uses which may be made of this \ninformation include provision of data to the President and his staff, other governmental entities, and the public. \nThe full list of routine uses for this correspondence can be found in the System of Records Notice titled, \u201cPrivacy \nAct of 1974; System of Records,\u201d published in Federal Register, September 15, 2011, Vol. 76, No. 179, at pages \n57078 through 57080; as amended by \u201cPrivacy Act of 1974; System of Records,\u201d published in the Federal \nRegister, May 25, 2017, Vol. 82, No. 100, at page 24161, and at the U.S. Department of Justice, Office of Privacy \nand Civil Liberties\' website at: https://www.justice.gov/opcl/doj-systems-records#OPA. \nBy signing the attached form, you consent to allowing the Office of the Pardon Attorney to obtain information \nregarding your citizenship and/or immigration status from the courts, from other government agencies, from other \ncomponents within the Department of Justice, and from the Department of Homeland Security, U.S. Citizenship \nand Immigration Services (DHS-USCIS), Systematic Alien Verification for Entitlements (SAVE) program. The \ninformation received from these sources will be used for the sole purposes of determining an applicant\'s \nqualification for a Certificate of Pardon under the December 22 proclamation and for record-keeping of those \ndeterminations. Further, please be aware that if the Office of the Pardon Attorney is unable to verify your \ncitizenship or immigration status based on the information provided below, we may contact you to obtain \nadditional verification information. Learn more about the DHS-USCIS\'s SAVE program and its ordinary uses. \nYour disclosure of information to the Office of the Pardon Attorney on this form is voluntary. If you do not \ncomplete all or some of the information fields in this form, however, the Office of the Pardon Attorney may not be \nable to effectively respond. Information regarding gender, race, or ethnicity is not required and will not affect the \nprocessing of the application. \nNote: Submit a separate form for each conviction or charge for which you are seeking a certificate of pardon. \nApplication Form on page 3. \nPage 2 of 4 \nUnited States Department of Justice Office of the Pardon Attorney Washington, D.C. 20530 January 2024 OMB Control No: 1123-0014 Expires 03/31/2027 \nAPPLICATION FOR CERTIFICATE OF PARDON FOR THE OFFENSES OF \nSIMPLE POSSESSION, ATTEMPTED SIMPLE POSSESSION, OR USE OF \nMARIJUANA \nComplete the following: \n<question>Name: <input label=Fst Name 1 instructions="First Name"><input label= instructions="Middle Name"><input label= instructions="Last Name"></question>\n(first) (middle) (last) \n<question>Name at Conviction: <input label=Conv Fst Name instructions="First Name at Conviction"><input label=Conv Mid Name instructions="Middle Name at Conviction"><input label=Conv Lst Name instructions="Last Name at Conviction"></question>\n(if different) (first) (middle) (last) \n<question>Address: <input label=Address instructions="Address (number, street, apartment/unit number)"></question>\n(number) (street) (apartment/unit no.) \n<question><input label=City instructions="City"><input label=State instructions="State"><input label=Zip Code instructions="(Zip Code)"></question>\n(city) (state) (Zip Code) \n<question>Email Address:  <input label=Email Address instructions="Email Address">Phone Number: <input label=Phone Number instructions="Phone Number"> </question>\n<question>Date of Birth: Gender: <input label=Date of Birth instructions="Date of Birth"><input label=Gender instructions="Gender"> Are you Hispanic or Latino?: Yes <input label= instructions="">No <input label= instructions=""></question>\n<question>Race: Alaska Native or American Indian <input label=Nat Amer instructions="Alaska Native or American Indian">Asian <input label=Asian instructions="Asian">Black or African American <input label=Blck Amer instructions="Black or African American"></question>\n<question>Native Hawaiian or Other Pacific Islander <input label=Nat Haw Islander instructions="Native Hawaiian or Other Pacific Islander">White <input label=White instructions="White">Other <input label=Other instructions="Other"></question>\nCitizenship or Residency Status: \n<question><input label= instructions="U S Citizen by birth">U.S. citizen by birth </question>\n<question><input label= instructions="U S naturalized citizen">U.S. naturalized citizen Date Naturalization Granted: <input label=Residency Date_af_date instructions="Date Residency Granted (mm/dd/yyyy)"><input label= instructions="date naturalization granted"></question>\n<question><input label= instructions="Lawful Permenent Resident">Lawful Permanent Resident Date Residency Granted: </question>\nAlien Registration Number (A-Number), Certificate of Naturalization Number, or Citizenship Number \n<question>(if applicant is a lawful permanent resident or naturalized citizen):  <input label=A-Number instructions="Alien Registration, Naturalization, or Citizenship Number"></question>\n(A-Number) \n<question>1.  Applicant was convicted on: <input label=Convict-Date_af_date instructions="Convict Date"> in the U.S. District Court for the  <input label=US District Court instructions="US District Court"></question>\n(month/day/year) (Northern, etc.) \n<question>District of  <input label=Dist State instructions="State">(state) or D.C. Superior Court of simple possession of marijuana, under </question>\n<question>Docket No. : <input label=Docket No instructions="Docket Number">and Code Section:  ; <input label=Code Section instructions="Code Section">OR </question>\n(docket number) (code section) \n<question>2.  Applicant was charged with Code Section:  <input label=Code Section_2 instructions="Code Section">in the U.S. District Court for the <input label=US District Court_2 instructions="U.S. District Court"> </question>\n(code section) (Eastern, etc.) \n<question>District of  <input label=District 2 instructions="State">or D.C. Superior Court under Docket No:  <input label=Docket No 2 instructions="Docket No 2"></question>\n(state) (docket number) \n \nUnited States Department of Justice Office of the Pardon Attorney Page 3 of 4 Washington, D.C. 20530 January 2024 OMB Control No: 1123-0014 Expires 03/31/2027 \nAPPLICATION FOR CERTIFICATE OF PARDON FOR THE OFFENSES OF \nSIMPLE POSSESSION, ATTEMPTED SIMPLE POSSESSION, OR USE OF \nMARIJUANA \nWith knowledge of the penalties for false statements to Federal Agencies, as provided by 18 \nU.S.C. \u00a7 1001, and with knowledge that this statement is submitted by me to affect action by \nthe U.S. Department of Justice, I certify that: \n1. The applicant was either a U.S. citizen or lawfully present in the United States at the time of the \noffense. \n2. The applicant was a U.S. citizen or lawful permanent resident on December 22, 2023. \n3. The above statements, and accompanying documents, are true and complete to the \n best of my knowledge, information, and belief. \n4. I acknowledge that any certificate issued in reliance on the above information will be \nvoided, if the information is subsequently determined to be false. \n<question><input label=App Date instructions="Date"></question>\n(date) (signature) \nPage 4 of 4 \nUnited States Department of Justice Office of the Pardon Attorney Washington, D.C. 20530 January 2024 ',
    form_summary: {
      component_type: 'form_summary',
      title: 'My Form Title',
      description: 'My Form Description',
    },
    elements: [
      {
        component_type: 'paragraph',
        text: "OMB Control No: 1123-0014 Expires 03/31/2027 APPLICATION FOR CERTIFICATE OF PARDON FOR THE OFFENSES OF SIMPLE POSSESSION, ATTEMPTED SIMPLE POSSESSION, OR USE OF MARIJUANA On October 6, 2022, President Biden issued a presidential proclamation that pardoned many federal and D.C. offenses for simple marijuana possession. On December 22, 2023, President Biden issued another proclamation that expanded the relief provided by the original proclamation by pardoning the federal offenses of simple possession, attempted possession, and use of marijuana. How a pardon can help you A pardon is an expression of the President\u2019s forgiveness. It does not mean you are innocent or expunge your conviction. But it does remove civil disabilities\u2014such as restrictions on the right to vote, to hold office, or to sit on a jury\u2014that are imposed because of the pardoned conviction. It may also be helpful in obtaining licenses, bonding, or employment. Learn more about the pardon. You qualify for the pardon if: \u2022 On or before December 22, 2023, you were charged with or convicted of simple possession, attempted possession, or use of marijuana under the federal code, the District of Columbia code, or the Code of Federal Regulations \u2022 You were a U.S. citizen or lawfully present in the United States at the time of the offense \u2022 You were a U.S. citizen or lawful permanent resident on December 22, 2023 Request a certificate to show proof of the pardon A Certificate of Pardon is proof that you were pardoned under the proclamation. The certificate is the only documentation you will receive of the pardon. Use the application below to start your request. What you'll need for the request About you You can submit a request for yourself or someone else can submit on your behalf. You must provide personal details, like name or citizenship status and either a mailing address, an email address or both to contact you. We strongly recommend including an email address, if available, as we may not be able to respond as quickly if you do not provide it. You can also use the mailing address or email address of another person, if you do not have your own. About the charge or conviction You must state whether it was a charge or conviction, the court district where it happened, and the date (month, day, year). If possible, you should also: \u2022 enter information about your case (docket or case number and the code section that was charged) \u2022 upload your documents o charging documents, like the indictment, complaint, criminal information, ticket or citation; or o conviction documents, like the judgment of conviction, the court docket sheet showing the sentence and date it was imposed, or if you did not go to court, the receipt showing payment of fine If you were charged by a ticket or citation and paid a fine instead of appearing in court, you should also provide the date of conviction or the date the fine was paid. Without this information, we can't guarantee that we'll be able to determine if you qualify for the pardon under the proclamation. Page 1 of 4 United States Department of Justice Office of the Pardon Attorney Washington, D.C. 20530 January 2024",
        style: 'normal',
        page: 0,
      },
      {
        component_type: 'paragraph',
        text: "OMB Control No: 1123-0014 Expires 03/31/2027 APPLICATION FOR CERTIFICATE OF PARDON FOR THE OFFENSES OF SIMPLE POSSESSION, ATTEMPTED SIMPLE POSSESSION, OR USE OF MARIJUANA Instructions: An online version of this application is available at: Presidential Proclamation on Marijuana Possession (justice.gov). You can also complete and return this application with the required documents to USPardon.Attorney@usdoj.gov or U.S. Department of Justice, Office of the Pardon Attorney, 950 Pennsylvania Avenue NW, Washington, DC 20530. Public Burden Statement: This collection meets the requirements of 44 U.S.C. \u00a7 3507, as amended by the Paperwork Reduction Act of 1995. We estimate that it will take 120 minutes to read the instructions, gather the relevant materials, and answer questions on the form. Send comments regarding the burden estimate or any other aspect of this collection of information, including suggestions for reducing this burden, to Office of the Pardon Attorney, U.S. Department of Justice, Attn: OMB Number 1123-0014, RFK Building, 950 Pennsylvania Avenue, N.W., Washington DC 20530. The OMB Clearance number, 1123-0014, is currently valid. Privacy Act Statement: The Office of the Pardon Attorney has authority to collect this information under the U.S. Constitution, Article II, Section 2 (the pardon clause); Orders of the Attorney General Nos. 1798-93, 58 Fed. Reg. 53658 and 53659 (1993), 2317-2000, 65 Fed. Reg. 48381 (2000), and 2323-2000, 65 Fed. Reg. 58223 and 58224 (2000), codified in 28 C.F.R. \u00a7\u00a7 1.1 et seq. (the rules governing petitions for executive clemency); and Order of the Attorney General No. 1012-83, 48 Fed. Reg. 22290 (1983), as codified in 28 C.F.R. \u00a7\u00a7 0.35 and 0.36 (the authority of the Office of the Pardon Attorney). The principal purpose for collecting this information is to enable the Office of the Pardon Attorney to issue an individual certificate of pardon to you. The routine uses which may be made of this information include provision of data to the President and his staff, other governmental entities, and the public. The full list of routine uses for this correspondence can be found in the System of Records Notice titled, \u201cPrivacy Act of 1974; System of Records,\u201d published in Federal Register, September 15, 2011, Vol. 76, No. 179, at pages 57078 through 57080; as amended by \u201cPrivacy Act of 1974; System of Records,\u201d published in the Federal Register, May 25, 2017, Vol. 82, No. 100, at page 24161, and at the U.S. Department of Justice, Office of Privacy and Civil Liberties' website at: https://www.justice.gov/opcl/doj-systems-records#OPA. By signing the attached form, you consent to allowing the Office of the Pardon Attorney to obtain information regarding your citizenship and/or immigration status from the courts, from other government agencies, from other components within the Department of Justice, and from the Department of Homeland Security, U.S. Citizenship and Immigration Services (DHS-USCIS), Systematic Alien Verification for Entitlements (SAVE) program. The information received from these sources will be used for the sole purposes of determining an applicant's qualification for a Certificate of Pardon under the December 22 proclamation and for record-keeping of those determinations. Further, please be aware that if the Office of the Pardon Attorney is unable to verify your citizenship or immigration status based on the information provided below, we may contact you to obtain additional verification information. Learn more about the DHS-USCIS's SAVE program and its ordinary uses. Your disclosure of information to the Office of the Pardon Attorney on this form is voluntary. If you do not complete all or some of the information fields in this form, however, the Office of the Pardon Attorney may not be able to effectively respond. Information regarding gender, race, or ethnicity is not required and will not affect the processing of the application. Note: Submit a separate form for each conviction or charge for which you are seeking a certificate of pardon. Application Form on page 3. Page 2 of 4 United States Department of Justice Office of the Pardon Attorney Washington, D.C. 20530 January 2024",
        style: 'normal',
        page: 1,
      },
      {
        component_type: 'paragraph',
        text: 'OMB Control No: 1123-0014 Expires 03/31/2027 APPLICATION FOR CERTIFICATE OF PARDON FOR THE OFFENSES OF SIMPLE POSSESSION, ATTEMPTED SIMPLE POSSESSION, OR USE OF MARIJUANA Complete the following:',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'Name: ',
        fields: [
          {
            component_type: 'text_input',
            id: 'Fst Name 1',
            label: 'First Name',
            default_value: '',
            required: true,
            page: 2,
          },
          {
            component_type: 'text_input',
            id: '',
            label: 'Middle Name',
            default_value: '',
            required: true,
            page: 2,
          },
          {
            component_type: 'text_input',
            id: '',
            label: 'Last Name',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: '(first) (middle) (last)',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'Name at Conviction: ',
        fields: [
          {
            component_type: 'text_input',
            id: 'Conv Fst Name',
            label: 'First Name at Conviction',
            default_value: '',
            required: true,
            page: 2,
          },
          {
            component_type: 'text_input',
            id: 'Conv Mid Name',
            label: 'Middle Name at Conviction',
            default_value: '',
            required: true,
            page: 2,
          },
          {
            component_type: 'text_input',
            id: 'Conv Lst Name',
            label: 'Last Name at Conviction',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: '(if different) (first) (middle) (last)',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'Address: ',
        fields: [
          {
            component_type: 'text_input',
            id: 'Address',
            label: 'Address (number, street, apartment/unit number)',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: '(number) (street) (apartment/unit no.)',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'City',
        fields: [
          {
            component_type: 'text_input',
            id: 'City',
            label: 'City',
            default_value: '',
            required: true,
            page: 2,
          },
          {
            component_type: 'text_input',
            id: 'State',
            label: 'State',
            default_value: '',
            required: true,
            page: 2,
          },
          {
            component_type: 'text_input',
            id: 'Zip Code',
            label: '(Zip Code)',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: '(city) (state) (Zip Code)',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'Email Address: ',
        fields: [
          {
            component_type: 'text_input',
            id: 'Email Address',
            label: 'Email Address',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'Phone Number: ',
        fields: [
          {
            component_type: 'text_input',
            id: 'Phone Number',
            label: 'Phone Number',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: 'Date of Birth: Gender:',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'Date of Birth',
        fields: [
          {
            component_type: 'text_input',
            id: 'Date of Birth',
            label: 'Date of Birth',
            default_value: '',
            required: true,
            page: 2,
          },
          {
            component_type: 'text_input',
            id: 'Gender',
            label: 'Gender',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'radio_group',
        legend: 'Are you Hispanic or Latino?: ',
        options: [
          {
            id: 'Yes',
            label: 'Yes ',
            name: 'Yes',
            default_checked: false,
            page: 2,
          },
          {
            id: 'No',
            label: 'No ',
            name: 'No',
            default_checked: false,
            page: 2,
          },
        ],
        id: 'Ethnicity',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'Race:',
        fields: [
          {
            component_type: 'checkbox',
            id: 'Nat Amer',
            label: 'Alaska Native or American Indian ',
            default_checked: false,
            struct_parent: 20,
            page: 2,
          },
          {
            component_type: 'checkbox',
            id: 'Asian',
            label: 'Asian ',
            default_checked: false,
            struct_parent: 21,
            page: 2,
          },
          {
            component_type: 'checkbox',
            id: 'Blck Amer',
            label: 'Black or African American ',
            default_checked: false,
            struct_parent: 22,
            page: 2,
          },
          {
            component_type: 'checkbox',
            id: 'Nat Haw Islander',
            label: 'Native Hawaiian or Other Pacific Islander ',
            default_checked: false,
            struct_parent: 23,
            page: 2,
          },
          {
            component_type: 'checkbox',
            id: 'White',
            label: 'White ',
            default_checked: false,
            struct_parent: 24,
            page: 2,
          },
          {
            component_type: 'checkbox',
            id: 'Other',
            label: 'Other ',
            default_checked: false,
            struct_parent: 25,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'radio_group',
        legend: 'Citizenship or Residency Status: ',
        options: [
          {
            id: 'Birth',
            label: 'U.S. citizen by birth ',
            name: 'Birth',
            default_checked: false,
            page: 2,
          },
          {
            id: 'Naturalized',
            label: 'U.S. naturalized citizen ',
            name: 'Naturalized',
            default_checked: false,
            page: 2,
          },
          {
            id: 'Permanent_Resident',
            label: 'Lawful Permanent Resident ',
            name: 'Permanent_Resident',
            default_checked: false,
            page: 2,
          },
        ],
        id: 'Citizenship',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'U.S. naturalized citizen ',
        fields: [
          {
            component_type: 'text_input',
            id: 'Residency Date_af_date',
            label: 'Date Residency Granted (mm/dd/yyyy)',
            default_value: '',
            required: true,
            page: 2,
          },
          {
            component_type: 'text_input',
            id: '',
            label: 'date naturalization granted',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: 'Date Residency Granted: Alien Registration Number (A-Number), Certificate of Naturalization Number, or Citizenship Number',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend:
          '(if applicant is a lawful permanent resident or naturalized citizen): ',
        fields: [
          {
            component_type: 'text_input',
            id: 'A-Number',
            label: 'Alien Registration, Naturalization, or Citizenship Number',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: '(A-Number) 1.',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: ' Applicant was convicted on: ',
        fields: [
          {
            component_type: 'text_input',
            id: 'Convict-Date_af_date',
            label: 'Convict Date',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'in the U.S. District Court for the ',
        fields: [
          {
            component_type: 'text_input',
            id: 'US District Court',
            label: 'US District Court',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: '(month/day/year) (Northern, etc.)',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'District of ',
        fields: [
          {
            component_type: 'text_input',
            id: 'Dist State',
            label: 'State',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: '(state) or D.C. Superior Court of simple possession of marijuana, under :',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'Docket No. ',
        fields: [
          {
            component_type: 'text_input',
            id: 'Docket No',
            label: 'Docket Number',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: ';',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'and Code Section: ',
        fields: [
          {
            component_type: 'text_input',
            id: 'Code Section',
            label: 'Code Section',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: 'OR (docket number) (code section) 2.',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: ' Applicant was charged with Code Section: ',
        fields: [
          {
            component_type: 'text_input',
            id: 'Code Section_2',
            label: 'Code Section',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'in the U.S. District Court for the ',
        fields: [
          {
            component_type: 'text_input',
            id: 'US District Court_2',
            label: 'U.S. District Court',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: '(code section) (Eastern, etc.)',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'District of ',
        fields: [
          {
            component_type: 'text_input',
            id: 'District 2',
            label: 'State',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: 'or',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'fieldset',
        legend: 'D.C. Superior Court under Docket No: ',
        fields: [
          {
            component_type: 'text_input',
            id: 'Docket No 2',
            label: 'Docket No 2',
            default_value: '',
            required: true,
            page: 2,
          },
        ],
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: '(state) (docket number) United States Department of Justice Office of the Pardon Attorney Page 3 of 4 Washington, D.C. 20530 January 2024',
        style: 'normal',
        page: 2,
      },
      {
        component_type: 'paragraph',
        text: 'OMB Control No: 1123-0014 Expires 03/31/2027 APPLICATION FOR CERTIFICATE OF PARDON FOR THE OFFENSES OF SIMPLE POSSESSION, ATTEMPTED SIMPLE POSSESSION, OR USE OF MARIJUANA With knowledge of the penalties for false statements to Federal Agencies, as provided by 18 U.S.C. \u00a7 1001, and with knowledge that this statement is submitted by me to affect action by the U.S. Department of Justice, I certify that: 1. The applicant was either a U.S. citizen or lawfully present in the United States at the time of the offense. 2. The applicant was a U.S. citizen or lawful permanent resident on December 22, 2023. 3. The above statements, and accompanying documents, are true and complete to the best of my knowledge, information, and belief. 4. I acknowledge that any certificate issued in reliance on the above information will be voided, if the information is subsequently determined to be false.',
        style: 'normal',
        page: 3,
      },
      {
        component_type: 'fieldset',
        legend: 'App Date',
        fields: [
          {
            component_type: 'text_input',
            id: 'App Date',
            label: 'Date',
            default_value: '',
            required: true,
            page: 3,
          },
        ],
        page: 3,
      },
      {
        component_type: 'paragraph',
        text: '(date) (signature) Page 4 of 4 United States Department of Justice Office of the Pardon Attorney Washington, D.C. 20530 January 2024',
        style: 'normal',
        page: 3,
      },
    ],
    raw_fields: {
      '0': [],
      '1': [],
      '2': [
        {
          type: '/Tx',
          var_name: 'Fst Name 1',
          field_dict: {
            field_type: '/Tx',
            coordinates: [97.0, 636.960022, 233.279999, 659.640015],
            field_label: 'Fst Name 1',
            field_instructions: 'First Name',
            struct_parent: 4,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Fst Name 1',
          struct_parent: 4,
        },
        {
          type: '/Tx',
          var_name: '',
          field_dict: {
            coordinates: [233.087006, 637.580994, 390.214996, 659.320007],
            field_instructions: 'Middle Name',
            struct_parent: 5,
            name: 0,
            field_type: '/Tx',
            font_info: '',
            field_label: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Mid Name 1/0',
          struct_parent: 5,
        },
        {
          type: '/Tx',
          var_name: '',
          field_dict: {
            coordinates: [390.996002, 637.492981, 548.124023, 659.231995],
            field_instructions: 'Last Name',
            struct_parent: 6,
            name: 0,
            field_type: '/Tx',
            font_info: '',
            field_label: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Lst Name 1/0',
          struct_parent: 6,
        },
        {
          type: '/Tx',
          var_name: 'Conv Fst Name',
          field_dict: {
            field_type: '/Tx',
            coordinates: [153.740005, 598.085022, 283.246002, 620.765015],
            field_label: 'Conv Fst Name',
            field_instructions: 'First Name at Conviction',
            struct_parent: 7,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Conv Fst Name',
          struct_parent: 7,
        },
        {
          type: '/Tx',
          var_name: 'Conv Mid Name',
          field_dict: {
            field_type: '/Tx',
            coordinates: [282.497986, 598.164001, 410.80899, 620.843994],
            field_label: 'Conv Mid Name',
            field_instructions: 'Middle Name at Conviction',
            struct_parent: 8,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Conv Mid Name',
          struct_parent: 8,
        },
        {
          type: '/Tx',
          var_name: 'Conv Lst Name',
          field_dict: {
            field_type: '/Tx',
            coordinates: [410.212006, 597.677002, 536.132019, 620.357971],
            field_label: 'Conv Lst Name',
            field_instructions: 'Last Name at Conviction',
            struct_parent: 9,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Conv Lst Name',
          struct_parent: 9,
        },
        {
          type: '/Tx',
          var_name: 'Address',
          field_dict: {
            field_type: '/Tx',
            coordinates: [102.839996, 563.880005, 547.080017, 586.559998],
            field_label: 'Address',
            field_instructions:
              'Address (number, street, apartment/unit number)',
            struct_parent: 10,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Address',
          struct_parent: 10,
        },
        {
          type: '/Tx',
          var_name: 'City',
          field_dict: {
            field_type: '/Tx',
            coordinates: [64.500504, 531.0, 269.519989, 551.880005],
            field_label: 'City',
            field_instructions: 'City',
            struct_parent: 11,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'City',
          struct_parent: 11,
        },
        {
          type: '/Tx',
          var_name: 'State',
          field_dict: {
            field_type: '/Tx',
            coordinates: [273.959991, 531.0, 440.519989, 551.880005],
            field_label: 'State',
            field_instructions: 'State',
            struct_parent: 12,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'State',
          struct_parent: 12,
        },
        {
          type: '/Tx',
          var_name: 'Zip Code',
          field_dict: {
            field_type: '/Tx',
            coordinates: [444.959991, 531.0, 552.719971, 551.880005],
            field_label: 'Zip Code',
            field_instructions: '(Zip Code)',
            struct_parent: 13,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Zip Code',
          struct_parent: 13,
        },
        {
          type: '/Tx',
          var_name: 'Email Address',
          field_dict: {
            field_type: '/Tx',
            coordinates: [131.863998, 489.600006, 290.743988, 512.280029],
            field_label: 'Email Address',
            field_instructions: 'Email Address',
            struct_parent: 14,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Email Address',
          struct_parent: 14,
        },
        {
          type: '/Tx',
          var_name: 'Phone Number',
          field_dict: {
            field_type: '/Tx',
            coordinates: [385.679993, 489.600006, 549.599976, 512.280029],
            field_label: 'Phone Number',
            field_instructions: 'Phone Number',
            struct_parent: 15,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Phone Number',
          struct_parent: 15,
        },
        {
          type: '/Tx',
          var_name: 'Date of Birth',
          field_dict: {
            field_type: '/Tx',
            coordinates: [126.480003, 451.679993, 197.880005, 474.359985],
            field_label: 'Date of Birth',
            field_instructions: 'Date of Birth',
            struct_parent: 16,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Date of Birth',
          struct_parent: 16,
        },
        {
          type: '/Tx',
          var_name: 'Gender',
          field_dict: {
            field_type: '/Tx',
            coordinates: [241.559998, 451.679993, 313.079987, 474.359985],
            field_label: 'Gender',
            field_instructions: 'Gender',
            struct_parent: 17,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Gender',
          struct_parent: 17,
        },
        {
          type: '/Btn',
          var_name: '',
          field_dict: {
            coordinates: [505.618988, 450.865997, 523.619019, 468.865997],
            struct_parent: 18,
            name: 'Yes',
            field_type: '/Btn',
            field_instructions: '',
            font_info: '',
            field_label: '',
            flags: {
              '15': 'NoToggleToOff: (Radio buttons only) If set, exactly one radio button must be selected at all times; clicking the currently selected button has no effect. If clear, clicking the selected button deselects it, leaving no button selected.',
              '16': 'Radio: If set, the field is a set of radio buttons; if clear, the field is a check box. This flag is meaningful only if the Pushbutton flag is clear.',
            },
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Ethnicity/Yes',
          struct_parent: 18,
        },
        {
          type: '/Btn',
          var_name: '',
          field_dict: {
            coordinates: [558.213013, 450.865997, 576.213013, 468.865997],
            struct_parent: 19,
            name: 'No',
            field_type: '/Btn',
            field_instructions: '',
            font_info: '',
            field_label: '',
            flags: {
              '15': 'NoToggleToOff: (Radio buttons only) If set, exactly one radio button must be selected at all times; clicking the currently selected button has no effect. If clear, clicking the selected button deselects it, leaving no button selected.',
              '16': 'Radio: If set, the field is a set of radio buttons; if clear, the field is a check box. This flag is meaningful only if the Pushbutton flag is clear.',
            },
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Ethnicity/No',
          struct_parent: 19,
        },
        {
          type: '/Btn',
          var_name: 'Nat Amer',
          field_dict: {
            field_type: '/Btn',
            coordinates: [280.10199, 426.162994, 298.10199, 444.162994],
            field_label: 'Nat Amer',
            field_instructions: 'Alaska Native or American Indian',
            struct_parent: 20,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Nat Amer',
          struct_parent: 20,
        },
        {
          type: '/Btn',
          var_name: 'Asian',
          field_dict: {
            field_type: '/Btn',
            coordinates: [366.563995, 426.162994, 384.563995, 444.162994],
            field_label: 'Asian',
            field_instructions: 'Asian',
            struct_parent: 21,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Asian',
          struct_parent: 21,
        },
        {
          type: '/Btn',
          var_name: 'Blck Amer',
          field_dict: {
            field_type: '/Btn',
            coordinates: [531.517029, 426.162994, 549.517029, 444.162994],
            field_label: 'Blck Amer',
            field_instructions: 'Black or African American',
            struct_parent: 22,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Blck Amer',
          struct_parent: 22,
        },
        {
          type: '/Btn',
          var_name: 'Nat Haw Islander',
          field_dict: {
            field_type: '/Btn',
            coordinates: [309.587006, 401.061005, 327.587006, 419.061005],
            field_label: 'Nat Haw Islander',
            field_instructions: 'Native Hawaiian or Other Pacific Islander',
            struct_parent: 23,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Nat Haw Islander',
          struct_parent: 23,
        },
        {
          type: '/Btn',
          var_name: 'White',
          field_dict: {
            field_type: '/Btn',
            coordinates: [438.681, 401.061005, 456.681, 419.061005],
            field_label: 'White',
            field_instructions: 'White',
            struct_parent: 24,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'White',
          struct_parent: 24,
        },
        {
          type: '/Btn',
          var_name: 'Other',
          field_dict: {
            field_type: '/Btn',
            coordinates: [508.806, 401.061005, 526.80603, 419.061005],
            field_label: 'Other',
            field_instructions: 'Other',
            struct_parent: 25,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Other',
          struct_parent: 25,
        },
        {
          type: '/Btn',
          var_name: '',
          field_dict: {
            coordinates: [98.414398, 349.662994, 116.414001, 367.662994],
            field_instructions: 'U S Citizen by birth',
            struct_parent: 26,
            name: 'Birth',
            field_type: '/Btn',
            font_info: '',
            field_label: '',
            flags: {
              '15': 'NoToggleToOff: (Radio buttons only) If set, exactly one radio button must be selected at all times; clicking the currently selected button has no effect. If clear, clicking the selected button deselects it, leaving no button selected.',
              '16': 'Radio: If set, the field is a set of radio buttons; if clear, the field is a check box. This flag is meaningful only if the Pushbutton flag is clear.',
            },
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Citizenship/Birth',
          struct_parent: 26,
        },
        {
          type: '/Btn',
          var_name: '',
          field_dict: {
            coordinates: [98.414398, 331.733002, 116.414001, 349.733002],
            field_instructions: 'U S naturalized citizen',
            struct_parent: 27,
            name: 'Naturalized',
            field_type: '/Btn',
            font_info: '',
            field_label: '',
            flags: {
              '15': 'NoToggleToOff: (Radio buttons only) If set, exactly one radio button must be selected at all times; clicking the currently selected button has no effect. If clear, clicking the selected button deselects it, leaving no button selected.',
              '16': 'Radio: If set, the field is a set of radio buttons; if clear, the field is a check box. This flag is meaningful only if the Pushbutton flag is clear.',
            },
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Citizenship/Naturalized',
          struct_parent: 27,
        },
        {
          type: '/Btn',
          var_name: '',
          field_dict: {
            coordinates: [98.414398, 313.006012, 116.414001, 331.006012],
            field_instructions: 'Lawful Permenent Resident',
            struct_parent: 29,
            name: 'Permanent Resident',
            field_type: '/Btn',
            font_info: '',
            field_label: '',
            flags: {
              '15': 'NoToggleToOff: (Radio buttons only) If set, exactly one radio button must be selected at all times; clicking the currently selected button has no effect. If clear, clicking the selected button deselects it, leaving no button selected.',
              '16': 'Radio: If set, the field is a set of radio buttons; if clear, the field is a check box. This flag is meaningful only if the Pushbutton flag is clear.',
            },
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Citizenship/Permanent Resident',
          struct_parent: 29,
        },
        {
          type: '/Tx',
          var_name: '',
          field_dict: {
            coordinates: [432.306, 331.979004, 489.425995, 352.92099],
            field_instructions: 'date naturalization granted',
            struct_parent: 28,
            name: 0,
            field_type: '/Tx',
            font_info: '',
            field_label: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Naturalization Date_af_date/0',
          struct_parent: 28,
        },
        {
          type: '/Tx',
          var_name: 'Residency Date_af_date',
          field_dict: {
            field_type: '/Tx',
            coordinates: [414.304993, 329.523987, 471.424988, 308.582001],
            field_label: 'Residency Date_af_date',
            field_instructions: 'Date Residency Granted (mm/dd/yyyy)',
            struct_parent: 30,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Residency Date_af_date',
          struct_parent: 30,
        },
        {
          type: '/Tx',
          var_name: 'A-Number',
          field_dict: {
            field_type: '/Tx',
            coordinates: [296.279999, 257.76001, 507.959991, 280.440002],
            field_label: 'A-Number',
            field_instructions:
              'Alien Registration, Naturalization, or Citizenship Number',
            struct_parent: 31,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'A-Number',
          struct_parent: 31,
        },
        {
          type: '/Tx',
          var_name: 'Convict-Date_af_date',
          field_dict: {
            field_type: '/Tx',
            coordinates: [203.602005, 218.822006, 301.363007, 245.341995],
            field_label: 'Convict-Date_af_date',
            field_instructions: 'Convict Date',
            struct_parent: 32,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Convict-Date_af_date',
          struct_parent: 32,
        },
        {
          type: '/Tx',
          var_name: 'US District Court',
          field_dict: {
            field_type: '/Tx',
            coordinates: [451.200012, 219.0, 522.719971, 241.679993],
            field_label: 'US District Court',
            field_instructions: 'US District Court',
            struct_parent: 33,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'US District Court',
          struct_parent: 33,
        },
        {
          type: '/Tx',
          var_name: 'Dist State',
          field_dict: {
            field_type: '/Tx',
            coordinates: [105.720001, 187.919998, 177.240005, 210.600006],
            field_label: 'Dist State',
            field_instructions: 'State',
            struct_parent: 34,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Dist State',
          struct_parent: 34,
        },
        {
          type: '/Tx',
          var_name: 'Docket No',
          field_dict: {
            field_type: '/Tx',
            coordinates: [114.015999, 153.479996, 262.575989, 176.160004],
            field_label: 'Docket No',
            field_instructions: 'Docket Number',
            struct_parent: 36,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Docket No',
          struct_parent: 36,
        },
        {
          type: '/Tx',
          var_name: 'Code Section',
          field_dict: {
            field_type: '/Tx',
            coordinates: [349.320007, 153.479996, 448.320007, 176.160004],
            field_label: 'Code Section',
            field_instructions: 'Code Section',
            struct_parent: 37,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Code Section',
          struct_parent: 37,
        },
        {
          type: '/Tx',
          var_name: 'Code Section_2',
          field_dict: {
            field_type: '/Tx',
            coordinates: [266.640015, 121.440002, 316.200012, 144.119995],
            field_label: 'Code Section_2',
            field_instructions: 'Code Section',
            struct_parent: 38,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Code Section_2',
          struct_parent: 38,
        },
        {
          type: '/Tx',
          var_name: 'US District Court_2',
          field_dict: {
            field_type: '/Tx',
            coordinates: [464.040009, 121.32, 542.039978, 144.0],
            field_label: 'US District Court_2',
            field_instructions: 'U.S. District Court',
            struct_parent: 39,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'US District Court_2',
          struct_parent: 39,
        },
        {
          type: '/Tx',
          var_name: 'District 2',
          field_dict: {
            field_type: '/Tx',
            coordinates: [105.720001, 86.760002, 188.160004, 109.440002],
            field_label: 'District 2',
            field_instructions: 'State',
            struct_parent: 40,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'District 2',
          struct_parent: 40,
        },
        {
          type: '/Tx',
          var_name: 'Docket No 2',
          field_dict: {
            field_type: '/Tx',
            coordinates: [403.920013, 86.760002, 525.0, 109.440002],
            field_label: 'Docket No 2',
            field_instructions: 'Docket No 2',
            struct_parent: 42,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 2,
          path: 'Docket No 2',
          struct_parent: 42,
        },
      ],
      '3': [
        {
          type: '/Tx',
          var_name: 'App Date',
          field_dict: {
            field_type: '/Tx',
            coordinates: [75.120003, 396.720001, 219.479996, 425.519989],
            field_label: 'App Date',
            field_instructions: 'Date',
            struct_parent: 44,
            font_info: '',
            hidden: false,
            child_fields: [],
            num_children: 0,
          },
          page_number: 3,
          path: 'App Date',
          struct_parent: 44,
        },
      ],
    },
    grouped_items: [],
    raw_fields_pages: {
      '0': "OMB Control No: 1123-0014 Expires 03/31/2027 \nAPPLICATION FOR CERTIFICATE OF PARDON FOR THE OFFENSES OF \nSIMPLE POSSESSION, ATTEMPTED SIMPLE POSSESSION, OR USE OF \nMARIJUANA \nOn October 6, 2022, President Biden issued a presidential proclamation that pardoned many federal and D.C. \noffenses for simple marijuana possession. On December 22, 2023, President Biden issued another proclamation that \nexpanded the relief provided by the original proclamation by pardoning the federal offenses of simple possession, \nattempted possession, and use of marijuana. \nHow a pardon can help you \nA pardon is an expression of the President\u2019s forgiveness. It does not mean you are innocent or expunge your \nconviction. But it does remove civil disabilities\u2014such as restrictions on the right to vote, to hold office, or to sit \non a jury\u2014that are imposed because of the pardoned conviction. It may also be helpful in obtaining licenses, \nbonding, or employment. Learn more about the pardon. \nYou qualify for the pardon if: \n\u2022 On or before December 22, 2023, you were charged with or convicted of simple possession, attempted \npossession, or use of marijuana under the federal code, the District of Columbia code, or the Code of \nFederal Regulations \n\u2022 You were a U.S. citizen or lawfully present in the United States at the time of the offense \n\u2022 You were a U.S. citizen or lawful permanent resident on December 22, 2023 \nRequest a certificate to show proof of the pardon \nA Certificate of Pardon is proof that you were pardoned under the proclamation. The certificate is the only \ndocumentation you will receive of the pardon. Use the application below to start your request. \nWhat you'll need for the request \nAbout you \nYou can submit a request for yourself or someone else can submit on your behalf. You must provide \npersonal details, like name or citizenship status and either a mailing address, an email address or both to \ncontact you. We strongly recommend including an email address, if available, as we may not be able to \nrespond as quickly if you do not provide it. You can also use the mailing address or email address of \nanother person, if you do not have your own. \nAbout the charge or conviction \nYou must state whether it was a charge or conviction, the court district where it happened, and the date \n(month, day, year). If possible, you should also: \n\u2022 enter information about your case (docket or case number and the code section that was \ncharged) \n\u2022 upload your documents \no charging documents, like the indictment, complaint, criminal information, ticket or \ncitation; or \no conviction documents, like the judgment of conviction, the court docket sheet showing \nthe sentence and date it was imposed, or if you did not go to court, the receipt showing \npayment of fine \nIf you were charged by a ticket or citation and paid a fine instead of appearing in court, you should also provide the \ndate of conviction or the date the fine was paid. \nWithout this information, we can't guarantee that we'll be able to determine if you qualify for the pardon under \nthe proclamation. \n \nPage 1 of 4 \nUnited States Department of Justice Office of the Pardon Attorney Washington, D.C. 20530 January 2024 ",
      '1': "OMB Control No: 1123-0014 Expires 03/31/2027 \nAPPLICATION FOR CERTIFICATE OF PARDON FOR THE OFFENSES OF \nSIMPLE POSSESSION, ATTEMPTED SIMPLE POSSESSION, OR USE OF \nMARIJUANA \nInstructions: \nAn online version of this application is available at: Presidential Proclamation on Marijuana Possession \n(justice.gov). You can also complete and return this application with the required documents to \nUSPardon.Attorney@usdoj.gov or U.S. Department of Justice, Office of the Pardon Attorney, 950 Pennsylvania \nAvenue NW, Washington, DC 20530. \nPublic Burden Statement: \nThis collection meets the requirements of 44 U.S.C. \u00a7 3507, as amended by the Paperwork Reduction Act of 1995. \nWe estimate that it will take 120 minutes to read the instructions, gather the relevant materials, and answer \nquestions on the form. Send comments regarding the burden estimate or any other aspect of this collection of \ninformation, including suggestions for reducing this burden, to Office of the Pardon Attorney, U.S. Department of \nJustice, Attn: OMB Number 1123-0014, RFK Building, 950 Pennsylvania Avenue, N.W., Washington DC 20530. \nThe OMB Clearance number, 1123-0014, is currently valid. \nPrivacy Act Statement: \nThe Office of the Pardon Attorney has authority to collect this information under the U.S. Constitution, Article \nII, Section 2 (the pardon clause); Orders of the Attorney General Nos. 1798-93, 58 Fed. Reg. 53658 and 53659 \n(1993), 2317-2000, 65 Fed. Reg. 48381 (2000), and 2323-2000, 65 Fed. Reg. 58223 and 58224 (2000), codified in \n28 C.F.R. \u00a7\u00a7 1.1 et seq. (the rules governing petitions for executive clemency); and Order of the Attorney General \nNo. 1012-83, 48 Fed. Reg. 22290 (1983), as codified in 28 C.F.R. \u00a7\u00a7 0.35 and 0.36 (the authority of the Office of \nthe Pardon Attorney). The principal purpose for collecting this information is to enable the Office of the Pardon \nAttorney to issue an individual certificate of pardon to you. The routine uses which may be made of this \ninformation include provision of data to the President and his staff, other governmental entities, and the public. \nThe full list of routine uses for this correspondence can be found in the System of Records Notice titled, \u201cPrivacy \nAct of 1974; System of Records,\u201d published in Federal Register, September 15, 2011, Vol. 76, No. 179, at pages \n57078 through 57080; as amended by \u201cPrivacy Act of 1974; System of Records,\u201d published in the Federal \nRegister, May 25, 2017, Vol. 82, No. 100, at page 24161, and at the U.S. Department of Justice, Office of Privacy \nand Civil Liberties' website at: https://www.justice.gov/opcl/doj-systems-records#OPA. \nBy signing the attached form, you consent to allowing the Office of the Pardon Attorney to obtain information \nregarding your citizenship and/or immigration status from the courts, from other government agencies, from other \ncomponents within the Department of Justice, and from the Department of Homeland Security, U.S. Citizenship \nand Immigration Services (DHS-USCIS), Systematic Alien Verification for Entitlements (SAVE) program. The \ninformation received from these sources will be used for the sole purposes of determining an applicant's \nqualification for a Certificate of Pardon under the December 22 proclamation and for record-keeping of those \ndeterminations. Further, please be aware that if the Office of the Pardon Attorney is unable to verify your \ncitizenship or immigration status based on the information provided below, we may contact you to obtain \nadditional verification information. Learn more about the DHS-USCIS's SAVE program and its ordinary uses. \nYour disclosure of information to the Office of the Pardon Attorney on this form is voluntary. If you do not \ncomplete all or some of the information fields in this form, however, the Office of the Pardon Attorney may not be \nable to effectively respond. Information regarding gender, race, or ethnicity is not required and will not affect the \nprocessing of the application. \nNote: Submit a separate form for each conviction or charge for which you are seeking a certificate of pardon. \nApplication Form on page 3. \nPage 2 of 4 \nUnited States Department of Justice Office of the Pardon Attorney Washington, D.C. 20530 January 2024 ",
      '2': 'OMB Control No: 1123-0014 Expires 03/31/2027 \nAPPLICATION FOR CERTIFICATE OF PARDON FOR THE OFFENSES OF \nSIMPLE POSSESSION, ATTEMPTED SIMPLE POSSESSION, OR USE OF \nMARIJUANA \nComplete the following: \n<question>Name: <input label=Fst Name 1 instructions="First Name"><input label= instructions="Middle Name"><input label= instructions="Last Name"></question>\n(first) (middle) (last) \n<question>Name at Conviction: <input label=Conv Fst Name instructions="First Name at Conviction"><input label=Conv Mid Name instructions="Middle Name at Conviction"><input label=Conv Lst Name instructions="Last Name at Conviction"></question>\n(if different) (first) (middle) (last) \n<question>Address: <input label=Address instructions="Address (number, street, apartment/unit number)"></question>\n(number) (street) (apartment/unit no.) \n<question><input label=City instructions="City"><input label=State instructions="State"><input label=Zip Code instructions="(Zip Code)"></question>\n(city) (state) (Zip Code) \n<question>Email Address:  <input label=Email Address instructions="Email Address">Phone Number: <input label=Phone Number instructions="Phone Number"> </question>\n<question>Date of Birth: Gender: <input label=Date of Birth instructions="Date of Birth"><input label=Gender instructions="Gender"> Are you Hispanic or Latino?: Yes <input label= instructions="">No <input label= instructions=""></question>\n<question>Race: Alaska Native or American Indian <input label=Nat Amer instructions="Alaska Native or American Indian">Asian <input label=Asian instructions="Asian">Black or African American <input label=Blck Amer instructions="Black or African American"></question>\n<question>Native Hawaiian or Other Pacific Islander <input label=Nat Haw Islander instructions="Native Hawaiian or Other Pacific Islander">White <input label=White instructions="White">Other <input label=Other instructions="Other"></question>\nCitizenship or Residency Status: \n<question><input label= instructions="U S Citizen by birth">U.S. citizen by birth </question>\n<question><input label= instructions="U S naturalized citizen">U.S. naturalized citizen Date Naturalization Granted: <input label=Residency Date_af_date instructions="Date Residency Granted (mm/dd/yyyy)"><input label= instructions="date naturalization granted"></question>\n<question><input label= instructions="Lawful Permenent Resident">Lawful Permanent Resident Date Residency Granted: </question>\nAlien Registration Number (A-Number), Certificate of Naturalization Number, or Citizenship Number \n<question>(if applicant is a lawful permanent resident or naturalized citizen):  <input label=A-Number instructions="Alien Registration, Naturalization, or Citizenship Number"></question>\n(A-Number) \n<question>1.  Applicant was convicted on: <input label=Convict-Date_af_date instructions="Convict Date"> in the U.S. District Court for the  <input label=US District Court instructions="US District Court"></question>\n(month/day/year) (Northern, etc.) \n<question>District of  <input label=Dist State instructions="State">(state) or D.C. Superior Court of simple possession of marijuana, under </question>\n<question>Docket No. : <input label=Docket No instructions="Docket Number">and Code Section:  ; <input label=Code Section instructions="Code Section">OR </question>\n(docket number) (code section) \n<question>2.  Applicant was charged with Code Section:  <input label=Code Section_2 instructions="Code Section">in the U.S. District Court for the <input label=US District Court_2 instructions="U.S. District Court"> </question>\n(code section) (Eastern, etc.) \n<question>District of  <input label=District 2 instructions="State">or D.C. Superior Court under Docket No:  <input label=Docket No 2 instructions="Docket No 2"></question>\n(state) (docket number) \n \nUnited States Department of Justice Office of the Pardon Attorney Page 3 of 4 Washington, D.C. 20530 January 2024 ',
      '3': 'OMB Control No: 1123-0014 Expires 03/31/2027 \nAPPLICATION FOR CERTIFICATE OF PARDON FOR THE OFFENSES OF \nSIMPLE POSSESSION, ATTEMPTED SIMPLE POSSESSION, OR USE OF \nMARIJUANA \nWith knowledge of the penalties for false statements to Federal Agencies, as provided by 18 \nU.S.C. \u00a7 1001, and with knowledge that this statement is submitted by me to affect action by \nthe U.S. Department of Justice, I certify that: \n1. The applicant was either a U.S. citizen or lawfully present in the United States at the time of the \noffense. \n2. The applicant was a U.S. citizen or lawful permanent resident on December 22, 2023. \n3. The above statements, and accompanying documents, are true and complete to the \n best of my knowledge, information, and belief. \n4. I acknowledge that any certificate issued in reliance on the above information will be \nvoided, if the information is subsequently determined to be false. \n<question><input label=App Date instructions="Date"></question>\n(date) (signature) \nPage 4 of 4 \nUnited States Department of Justice Office of the Pardon Attorney Washington, D.C. 20530 January 2024 ',
    },
  },
  cache_id: 'Cache ID is not implemented yet',
};
