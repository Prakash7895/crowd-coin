'use client';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import factory from '../../factory';
import web3 from '../../web3';

const NewCampaignForm = () => {
  const [minumumAmount, setMinumumAmount] = useState('');
  const [inputError, setInputError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [responseState, setResponseState] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!minumumAmount || /^\d+$/.test(minumumAmount)) {
      setInputError('');
    } else {
      setInputError('Only numbers are allowed.');
    }
  }, [minumumAmount]);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!minumumAmount.trim()) {
      setInputError('Minimum Amount is required.');
    }
    if (!inputError) {
      setLoading(true);
      setResponseState(null);
      try {
        const accounts = await web3.eth.getAccounts();
        console.log('Accounts', accounts);
        const res = await factory.methods.createCampaign(minumumAmount).send({
          from: accounts[0],
        });
        console.log('RES', res);
        setLoading(false);
        setMinumumAmount('');
        setInputError('');
        setResponseState({
          success: true,
          message: 'Campaign created successfully!',
        });
      } catch (err: any) {
        console.log('err', err);
        setLoading(false);
        setInputError('');
        setResponseState({ success: false, message: err.message });
      }
    }
  };

  return (
    <div>
      <form className='my-5 flex flex-col items-start' onSubmit={onSubmit}>
        <label className='form-control w-full max-w-xs'>
          <div className='label'>
            <span className='label-text'>Minimum Contribution</span>
          </div>
          <div className='relative'>
            <input
              type='text'
              placeholder='Type here'
              className={`input z-10 pr-14 relative !bg-transparent input-bordered w-full max-w-xs ${
                inputError ? 'input-error' : ''
              }`}
              value={minumumAmount}
              onChange={(e) => {
                setMinumumAmount(e.target.value);
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
          <small className='text-error mt-1.5'>{inputError}</small>
        </label>
        <button
          disabled={!(minumumAmount && !inputError) || loading}
          className='btn btn-primary disabled:bg-primary disabled:text-primary-content disabled:opacity-35 mt-4'
          type='submit'
        >
          {loading && <span className='loading loading-dots'></span>}
          Primary
        </button>
      </form>
      {responseState && (
        <div>
          <p className={responseState.success ? 'text-success' : 'text-error'}>
            {responseState.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default NewCampaignForm;
