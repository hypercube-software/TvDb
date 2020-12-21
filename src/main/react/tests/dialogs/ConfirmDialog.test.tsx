import React from "react";
import { shallow } from "enzyme";

import {
  ConfirmDialog,
  DialogType,
  DialogButton,
} from "../../src/widgets/dialogs/ConfirmDialog";

import { Button } from '@material-ui/core';

describe("ConfirmDialog tests", () => {
  test("Render Error Dialog then click", () => {
    let confimButton = null;  
    const onCloseDialogError = (confirm: DialogButton) => {
        confimButton = confirm;
    };
    const dialog = shallow(
      <ConfirmDialog
        title="Error"
        type={DialogType.ERROR}
        content="The content"
        onResponse={onCloseDialogError}
      />
    );
    dialog.find(Button).simulate("click");
    expect(confimButton).toEqual(DialogButton.OK);
  });

  test("Render Error Dialog", () => {
    const onCloseDialogError = () => {
      //        
    };
    const dialog = shallow(
      <ConfirmDialog
        title="Error"
        type={DialogType.ERROR}
        content="The content"
        onResponse={onCloseDialogError}
      />
    );
    expect(dialog).toMatchSnapshot();
  });

});

