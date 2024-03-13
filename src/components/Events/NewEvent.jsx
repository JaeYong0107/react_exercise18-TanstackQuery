import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx'
import { createNewEvent, queryClient } from '../../util/http.js';

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] }); // 해당 키가 포함된 모든 쿼리를 무효화 한다.
      navigate('/events'); // onSuccess 속성에 navigate하면 작업이 완료된 후 에 페이지를 이동할 수 있게됨.
    }                      // 또한 오류가 발생 했을 시에는 화면이동이 발생하지 않게 되어 오류 메시지를 볼 수 있음.
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Submitting...'}
        {!isPending && <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>}
      </EventForm>
      {isError && <ErrorBlock
        title="Failed to create event"
        message={error.info?.message ||
          'Failed to create event. Please check your inputs and try again later.'} />
      }
    </Modal>
  );
}
