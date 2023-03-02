import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores';
import { Footer, Header } from './components';
import { ActionModalConfig } from 'stores/ActionModals';
import { useMemo, useRef } from 'react';
import { observable } from 'mobx';
import { FETCH_STATUS } from 'stores/ActiveStream';
import { ModalView } from './components/ModalView';
import { Button } from 'components/Button';

export type TActionModalProps<T = any> = {
  config: ActionModalConfig;
  actionData: TActionDataType<T>;
  ref: any;
  onValidate: {
    callback?: () => Promise<any>;
  };
};

export type TActionDataType<T = any> = {
  isValid: boolean;
  data?: T;
};

function isClassComponent(component: any) {
  return (
    (!!component.prototype && !!component.prototype.isReactComponent) ||
    typeof component !== 'function'
  );
}

export const ActionModal = observer<{
  config: ActionModalConfig;
  visible: boolean;
}>(({ config, visible }) => {
  const { modals } = useStores();
  const { render: Render, options, id } = config;

  const actionData = useMemo(
    () =>
      observable({
        isValid: config.options.noValidation,
        data: config.options.initData || {},
      }),
    [],
  );

  const bodyRef = useRef<{ onValidate?: () => Promise<any> }>();

  const { width = '750px', position = 'center' } = options;

  const onClose = () => modals.close(id);

  const isActionLoading = config.actionStatus === FETCH_STATUS.LOADING;

  const onApply = (data: any) => {
    config.actionStatus = FETCH_STATUS.LOADING;

    return options
      .onApply(data)
      .then(res => {
        config.actionStatus = FETCH_STATUS.SUCCESS;

        return res;
      })
      .catch((err: any) => {
        config.actionStatus = FETCH_STATUS.ERROR;

        throw err;
      });
  };

  const onValidate: { callback?: () => Promise<any> } = useMemo(() => ({}), []);

  return (
    <ModalView
      width={width}
      position={position}
      onClose={onClose}
      style={{ visibility: visible ? 'visible' : 'hidden' }}
      config={config}
    >
      {false ? (
        <Header
          title={options.title}
          onClose={onClose}
          pending={isActionLoading}
        />
      ) : null}
      {!isClassComponent(Render) ? (
        Render({ actionData })
      ) : (
        <Render
          config={config}
          actionData={actionData}
          onValidate={onValidate}
          ref={bodyRef}
        />
      )}
      <Footer>
        {options.closeText && (
          <Button
            size="auto"
            transparent
            onClick={onClose}
            color="Basic700"
            disabled={isActionLoading}
          >
            {options.closeText}
          </Button>
        )}
        {options.applyText ? (
          <Button
            margin="0 0 0 24px"
            size="auto"
            onClick={() => {
              if (bodyRef && onValidate.callback) {
                onValidate
                  .callback()
                  .then(onApply)
                  .catch((err: any) => {
                    config.actionStatus = FETCH_STATUS.ERROR;
                    modals.rejectError(config.id, err);
                    throw err;
                  });
              } else {
                onApply(actionData.data);
              }
            }}
            disabled={isActionLoading || !actionData.isValid}
          >
            {options.applyText || 'Ok'}
          </Button>
        ) : null}
      </Footer>
    </ModalView>
  );
});

export const ActionModals: React.FC = observer(() => {
  const { modals } = useStores();

  return (
    <>
      {modals.pool.map((config, idx) => (
        <ActionModal
          key={config.id}
          config={config}
          visible={modals.pool.length - 1 === idx}
        />
      ))}
    </>
  );
});
