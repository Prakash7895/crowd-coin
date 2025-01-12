import React, {
  FormEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ContextToast } from './ToastContext';
import useCampaign from '@/hooks/useCampaign';
import web3 from '../../web3';
import { usePathname } from 'next/navigation';
import Title from './Title';
import { fetchAccounts } from '../../campaign';

const isValidEthereumAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const RequestForm = () => {
  const [formState, setFormState] = useState({
    amount: '',
    description: '',
    recipient: '',
  });

  const [inputError, setInputError] = useState({
    amount: '',
    description: '',
    recipient: '',
  });
  const [loading, setLoading] = useState(false);

  const { setState } = useContext(ContextToast);

  const pathName = usePathname();

  const { campaignRef } = useCampaign(pathName.split('/')[2]);

  useEffect(() => {
    if (!formState.amount.trim() || /^\d+$/.test(formState.amount)) {
      setInputError((p) => ({ ...p, amount: '' }));
    } else {
      setInputError((p) => ({ ...p, amount: 'Only numbers are allowed.' }));
    }

    if (!formState.recipient.trim()) {
      setInputError((p) => ({ ...p, recipient: '' }));
    } else if (!isValidEthereumAddress(formState.recipient)) {
      setInputError((p) => ({ ...p, recipient: 'Invalid Ethereum address.' }));
    }

    if (!formState.description.trim()) {
      setInputError((p) => ({ ...p, description: '' }));
    }
  }, [formState]);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accounts = await fetchAccounts();
      console.log('Accounts', accounts);
      const res = await campaignRef.current?.methods
        .createRequest(
          formState.description,
          formState.amount,
          formState.recipient
        )
        .send({
          from: accounts[0],
          gas: '1000000',
        });

      console.log('RES', res);
      setLoading(false);

      setInputError({
        amount: '',
        description: '',
        recipient: '',
      });
      setFormState({
        amount: '',
        description: '',
        recipient: '',
      });

      setState({
        show: true,
        type: 'success',
        title: 'Success',
        message: 'New request created successfully!',
      });
    } catch (err: any) {
      console.log('err', err);
      setLoading(false);
      setInputError({
        amount: '',
        description: '',
        recipient: '',
      });
      setState({
        show: true,
        type: 'error',
        title: 'Error',
        message: err?.message,
      });
    }
  };

  return (
    <div>
      <form
        className='my-5 lg:my-0 p-3.5 card bg-base-100 flex flex-col items-start'
        onSubmit={onSubmit}
      >
        <Title text='Create New Request' />
        <label className='form-control w-full max-w-xs'>
          <div className='label'>
            <span className='label-text'>Description</span>
          </div>
          <input
            type='text'
            placeholder='Type here'
            className={`input !bg-transparent input-bordered w-full max-w-xs ${
              inputError.description ? 'input-error' : ''
            }`}
            value={formState.description}
            onChange={(e) => {
              const value = e.target.value;
              setFormState((p) => ({ ...p, description: value }));
            }}
            disabled={loading}
          />

          <small className='text-error mt-1.5'>{inputError.description}</small>
        </label>

        <label className='form-control w-full max-w-xs'>
          <div className='label'>
            <span className='label-text'>Amount</span>
          </div>
          <div className='relative'>
            <input
              type='text'
              placeholder='Type here'
              className={`input z-10 text-right pr-14 relative !bg-transparent input-bordered w-full max-w-xs ${
                inputError.amount ? 'input-error' : ''
              }`}
              value={formState.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*$/.test(value)) {
                  setFormState((p) => ({ ...p, amount: value }));
                }
              }}
              disabled={loading}
            />
            <div
              className={`absolute z-0 right-0 h-full top-0 bg-gray-700 rounded-r-lg text-center flex items-center px-2 ${
                loading ? 'opacity-40' : ''
              }`}
            >
              <p>WEI</p>
            </div>
          </div>
          <small className='text-error mt-1.5'>{inputError.amount}</small>
        </label>

        <label className='form-control w-full max-w-xs'>
          <div className='label'>
            <span className='label-text'>Recipient</span>
          </div>
          <input
            type='text'
            placeholder='Type here'
            className={`input !bg-transparent input-bordered w-full max-w-xs ${
              inputError.recipient ? 'input-error' : ''
            }`}
            value={formState.recipient}
            onChange={(e) => {
              const value = e.target.value;
              setFormState((p) => ({ ...p, recipient: value }));
            }}
            disabled={loading}
          />

          <small className='text-error mt-1.5'>{inputError.recipient}</small>
        </label>

        <button
          disabled={
            !(
              formState.amount.trim() &&
              formState.description.trim() &&
              formState.recipient.trim() &&
              !inputError.amount &&
              !inputError.description &&
              !inputError.recipient
            ) || loading
          }
          className='btn btn-primary disabled:bg-primary disabled:text-primary-content disabled:opacity-35 mt-4'
          type='submit'
        >
          {loading && <span className='loading loading-dots'></span>}
          Create!
        </button>
      </form>
    </div>
  );
};

export default RequestForm;
