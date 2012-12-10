<?php
return array(
    'initial' => 'enterCredentials',
    'node' => array(
        array('id'=>'enterCredentials',         'transition'=>'waitingForPayment'),
        //! FIXME do we need timelimit state
        array('id'=>'waitingForPayment',        'transition'=>'bookingTimeLimitError,paid'),
        array('id'=>'bookingTimeLimitError',    'transition'=>'error'),
        array('id'=>'paid',                     'transition'=>'ticketing'),
        array('id'=>'ticketing',                'transition'=>'ticketReady,ticketingRepeat,ticketingError'),
        array('id'=>'ticketReady',              'transition'=>'moneyTransfer,done'),
        array('id'=>'ticketingRepeat',          'transition'=>'ticketingRepeat,ticketReady,manualProcessing,ticketingError'),
        array('id'=>'manualProcessing',         'transition'=>'ticketingError,manualTicketing'),
        array('id'=>'manualTicketing',          'transition'=>'manualSuccess,manualError'),
        array('id'=>'ticketingError',           'transition'=>'moneyReturn'),
        array('id'=>'manualError',              'transition'=>'moneyReturn'),
        array('id'=>'moneyReturn',              'transition'=>'error'),
        array('id'=>'manualSuccess',            'transition'=>'done'),
        array('id'=>'moneyTransfer',            'transition'=>'done'),
        array('id'=>'done'),
        array('id'=>'error')
    )
);