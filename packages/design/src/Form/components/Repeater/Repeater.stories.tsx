import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Repeater from './index.js';
// import { expect, userEvent } from '@storybook/test';
import { FormProvider, useForm } from 'react-hook-form';

// TODO: Add tests for the repeater once it's fully implemented

export default {
  title: 'patterns/Repeater',
  component: Repeater,
  decorators: [
    (Story, args) => {
      const FormDecorator = () => {
        const formMethods = useForm();
        return (
          <FormProvider {...formMethods}>
            <Story {...args} />
          </FormProvider>
        );
      };
      return <FormDecorator />;
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Repeater>;

const defaultArgs = {
  legend: 'Default Heading',
  _patternId: 'test-id',
};

export const Default = {
  args: {
    ...defaultArgs,
    type: 'repeater',
  },
} satisfies StoryObj<typeof Repeater>;

// export const WithContents = {
//   play: async ({ mount, args }) => {
//     const canvas = await mount(<Repeater {...args} />);

//     const addButton = canvas.getByRole('button', { name: /Add new item/ });
//     const deleteButton = canvas.getByRole('button', { name: /Delete item/ });
//     await userEvent.click(addButton);

//     let inputs = canvas.queryAllByRole('textbox');
//     await expect(inputs).toHaveLength(1);

//     await userEvent.click(deleteButton);
//     inputs = canvas.queryAllByRole('textbox');
//     await expect(inputs).toHaveLength(0);
//   },
//   args: {
//     ...defaultArgs,
//     type: 'repeater',
//     children: [
//       <div key="unique-key-1" className="usa-form-group-wrapper">
//         <label className="usa-label" htmlFor="input">
//           Input
//         </label>
//         <input className="usa-input" type="text" id="input" name="input" />
//       </div>,
//     ],
//   },
// } satisfies StoryObj<typeof Repeater>;
