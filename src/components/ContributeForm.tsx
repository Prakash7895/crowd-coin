import {
  FC,
  FormEventHandler,
  RefObject,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Contract } from 'web3';
import { ContextToast } from './ToastContext';
import { fetchAccounts } from '../../campaign';

interface IContributeForm {
  minimumAmount: number;
  campaignRef: RefObject<Contract<any> | null>;
  onSuccess: () => void;
}

const ContributeForm: FC<IContributeForm> = ({
  minimumAmount,
  campaignRef,
  onSuccess,
}) => {
  const [amount, setAmount] = useState('');

  const [inputError, setInputError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setState } = useContext(ContextToast);

  useEffect(() => {
    if (!amount || /^\d+$/.test(amount)) {
      if (amount && +amount < minimumAmount) {
        setInputError(`Minimum amount of ${minimumAmount} Wei is required!`);
      } else {
        setInputError('');
      }
    } else {
      setInputError('Only numbers are allowed.');
    }
  }, [amount]);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!amount.trim()) {
      setInputError('Minimum Amount is required.');
    } else if (amount && +amount < minimumAmount) {
      setInputError(`Minimum amount of ${minimumAmount} Wei is required!`);
    }
    if (!inputError) {
      setLoading(true);

      try {
        const accounts = await fetchAccounts();
        console.log('Accounts', accounts);
        const res = await campaignRef.current!.methods.contribute().send({
          from: accounts[0],
          value: amount,
        });

        console.log('RES', res);
        setLoading(false);
        setAmount('');
        setInputError('');
        onSuccess();
        setState({
          show: true,
          type: 'success',
          title: 'Success',
          message: 'Contributed to Campaign successfully!',
        });
      } catch (err: any) {
        console.log('err', err);
        setLoading(false);
        setInputError('');
        setState({
          show: true,
          type: 'error',
          title: 'Error',
          message: err?.message,
        });
      }
    }
  };

  return (
    <div className='lg:px-8'>
      <form
        className='my-5 lg:my-0 p-3.5 card bg-base-100 flex flex-col items-start'
        onSubmit={onSubmit}
      >
        <label className='form-control w-full max-w-xs'>
          <div className='label'>
            <span className='label-text'>Contribute to this campaign!</span>
          </div>
          <div className='relative'>
            <input
              type='text'
              placeholder='Type here'
              className={`input z-10 text-right pr-14 relative !bg-transparent input-bordered w-full max-w-xs ${
                inputError ? 'input-error' : ''
              }`}
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*$/.test(value)) {
                  setAmount(value);
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
          <small className='text-error mt-1.5'>{inputError}</small>
        </label>
        <button
          disabled={!(amount && !inputError) || loading}
          className='btn btn-primary disabled:bg-primary disabled:text-primary-content disabled:opacity-35 mt-4'
          type='submit'
        >
          {loading && <span className='loading loading-dots'></span>}
          Contribute!
        </button>
      </form>
    </div>
  );
};

export default ContributeForm;
