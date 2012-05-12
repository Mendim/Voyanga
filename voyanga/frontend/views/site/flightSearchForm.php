<?php
return array(
    'title'=>'Параметры поиска',

    'elements'=>array(
        'departureCityId'=>array(
            'id'=>'departureCityId',
            'type'=>'text',
            'value'=>'4466',
            'maxlength'=>32,
        ),
        'departureCity'=>array(
            'type'=>'zii.widgets.jui.CJuiAutoComplete',
            'attributes'=>array(
                    'name'=>'departureCity',
                    'source'=>Yii::app()->createUrl('site/cityAutocomplete'),
                    // additional javascript options for the autocomplete plugin
                    'options'=>array(
                        'minLength'=>'2',
                        'select'=>'js:function(event, ui) { $(\'#departureCityId\').val(ui.item.id); }'
                    ),
                    'htmlOptions'=>array(
                        'style'=>'height:20px;'
                    ),

                )
        ),
        'arrivalCityId'=>array(
            'id'=>'arrivalCityId',
            'type'=>'text',
            'value'=>'5754',
            'maxlength'=>32,
        ),
        'arrivalCity'=>array(
            'type'=>'zii.widgets.jui.CJuiAutoComplete',
            'attributes'=>array(
                'name'=>'arrivalCity',
                'source'=>Yii::app()->createUrl('site/cityAutocomplete'),
                // additional javascript options for the autocomplete plugin
                'options'=>array(
                    'minLength'=>'2',
                    'select'=>'js:function(event, ui) { $(\'#arrivalCityId\').val(ui.item.id); }'
                ),
                'htmlOptions'=>array(
                    'style'=>'height:20px;'
                ),
            )
        ),
        'departureDate'=>array(
            'type'=>'text',
            'value'=>'12.07.2012',
            'maxlength'=>32,
        ),
        'adultCount'=>array(
            'type'=>'dropdownlist',
            'val'=>1,
            'items'=>array(0,1,2,3,4,5,6,7),
        ),
        'childCount'=>array(
            'type'=>'dropdownlist',
            'items'=>array(0,1,2,3,4,5,6,7),
        ),
        'infantCount'=>array(
            'type'=>'dropdownlist',
            'items'=>array(0,1,2,3,4,5,6,7),
        ),

    ),

    'buttons'=>array(
        'smb'=>array(
            'type'=>'submit',
            'label'=>'OK',
        ),
    ),
);