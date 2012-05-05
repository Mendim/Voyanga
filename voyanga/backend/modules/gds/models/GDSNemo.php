<?php
class GDSNemo extends CComponent
{
    public $wsdlUri = null;

    /**
     * @static
     * @param $methodName name of method to call
     * @param $params params for calling method
     * @param bool $cache is cache it
     * @param int $expiration expiration time in seconds
     * @return mixed
     */
    private static function request($methodName, $params, $cache = FALSE, $expiration = 0)
    {
        $client = new GDSNemoSoapClient(Yii::app()->params['GDSNemo']['wsdlUri'], array('trace' => Yii::app()->params['GDSNemo']['trace'],'exceptions'=>true,
            //'typemap' => array(
            //            array(
            //                    'type_ns' => 'http://tempuri.org/',
            //                    'type_name' => 'Search' ) )
        ));
        VarDumper::dump($params);

        //VarDumper::dump($client->__getFunctions());
        //VarDumper::dump($client->__getTypes());
        //$params = array('Search'=>$params);
        return $client->$methodName($params);
    }

    public function FlightSearch(FlightSearchParams $flightSearchParams)
    {
        if (!($flightSearchParams instanceof FlightSearchParams))
        {
            throw new CException(Yii::t('application', 'Parameter oFlightSearchParams not type of FlightSearchParams'));
        }
        VarDumper::dump($flightSearchParams);
        //prepare request  structure
        $params = array(
            'Request' => array(
                'Requisites' => array('Login' => Yii::app()->params['GDSNemo']['login'], 'Password' => Yii::app()->params['GDSNemo']['password']),
                'RequestType'=>'U',
                'UserID' => Yii::app()->params['GDSNemo']['userId'],
                'Search' => array(
                    'LinkOnly' => 'false',
                    'ODPairs' => array(
                        'Type' => 'OW',
                        'Direct' => false,
                        'AroundDates' => "0",

                        'ODPair' => array(
                            'DepDate' => '2012-06-13T00:00:00',
                            'DepAirp' => 'MOW',
                            'ArrAirp' =>  'IJK'

                        )
                    ),
                    'Travellers' => array(
                        'Traveller' => array(
                            array(
                                'Type' => 'ADT',
                                'Count' => '1'
                            )
                        )
                    ),
                    'Restrictions' => array(
                        'ClassPref' => 'All',
                        'OnlyAvail' => true,
                        'AirVPrefs' => '',
                        'IncludePrivateFare' => false,
                        'CurrencyCode' => 'RUB'
                    )
                )
            )
        );
        $pairs = array();
        foreach ($flightSearchParams->routes as $route)
        {
            //todo: think how to name it
            $ODPair = array();
            $ODPair['DepDate'] = $route->departureDate . 'T00:00:00';
            $ODPair['DepAirp'] =  $route->departureCity->code;
            $ODPair['ArrAirp'] = $route->arrivalCity->code;
            $pairs[] = $ODPair;
        }
        $flightType = 'OW';
        if (count($flightSearchParams->routes) == 2)
        {
            $equalFrom = $flightSearchParams->routes[0]->departureCityId === $flightSearchParams->routes[1]->arrivalCityId;
            $equalTo = $flightSearchParams->routes[0]->arrivalCityId === $flightSearchParams->routes[1]->departureCityId;
            if ($equalFrom && $equalTo)
            {
                $flightType = 'RT';
            } else
            {
                $flightType = 'CR';
            }
        } elseif (count($flightSearchParams->routes) > 2)
        {
            $flightType = 'CR';
        }
        $params['Request']['Search']['ODPairs']['Type'] = $flightType;
        $params['Request']['Search']['ODPairs']['ODPair'] = UtilsHelper::normalizeArray($pairs);
        unset($pairs);

        $traveller = array();
        if ($flightSearchParams->adultCount > 0)
        {
            $traveller = array(
                'Type' => 'ADT',
                'Count' => $flightSearchParams->adultCount
            );
        }
        if ($flightSearchParams->childCount > 0)
        {
            $traveller = array(
                'Type' => 'CNN',
                'Count' => $flightSearchParams->childCount
            );
        }
        if ($flightSearchParams->infantCount > 0)
        {
            $traveller = array(
                'Type' => 'INF',
                'Count' => $flightSearchParams->infantCount
            );
        }
        $params['Request']['Search']['Travellers']['Traveller'] = UtilsHelper::normalizeArray($traveller);
        unset($traveller);

        //real request

        $soapResponse = self::request('Search', $params, $bCache = FALSE, $iExpiration = 0);
        print_r($soapResponse);
        return;

        //processing response


        //print_r( $oSoapResponse );
        Yii::beginProfile('processingSoap');
        $flights = array();
        UtilsHelper::soapObjectsArray($soapResponse->Response->SearchFlights->Flights->Flight);
        foreach ($soapResponse->Response->SearchFlights->Flights->Flight as $oSoapFlight)
        {
            $aParts = array();
            Yii::beginProfile('processingSegments');
            UtilsHelper::soapObjectsArray($oSoapFlight->Segments->Segment);
            foreach ($oSoapFlight->Segments->Segment as $oSegment)
            {
                $oPart = new stdClass();
                Yii::beginProfile('laodAirportData');
                $oPart->departure_airport = Airport::getAirportByCode($oSegment->DepAirp->_);
                //Yii::endProfile('laodAirportData');
                $oPart->departure_city = $oPart->departure_airport->city;
                //Yii::beginProfile('laodAirportData');
                $oPart->arrival_airport = Airport::getAirportByCode($oSegment->ArrAirp->_);

                $oPart->arrival_city = $oPart->arrival_airport->city;
                Yii::endProfile('laodAirportData');
                $oPart->departure_terminal_code = $oSegment->DepTerminal;
                $oPart->arrival_terminal_code = $oSegment->ArrTerminal;
                $oPart->airline = Airline::getAirlineByCode($oSegment->MarkAirline);
                $oPart->code = $oSegment->FlightNumber;
                $oPart->duration = $oSegment->FlightTime * 60;
                $oPart->datetime_begin = $oSegment->DepDateTime->_;
                $oPart->datetime_end = $oSegment->DepDateTime->_;
                $oPart->aircraft_code = $oSegment->AircraftType;
                $oPart->transport_airline = Airline::getAirlineByCode($oSegment->OpAirline);
                $oPart->aTariffs = array();
                $oPart->aTaxes = array();
                $oPart->aBookingCodes = array();
                UtilsHelper::soapObjectsArray($oSegment->BookingCodes->BookingCode);
                foreach ($oSegment->BookingCodes->BookingCode as $sBookingCode)
                {
                    $oPart->aBookingCodes[] = $sBookingCode;
                }
                $aParts[$oSegment->SegNum] = $oPart;
            }
            Yii::endProfile('processingSegments');
            $full_sum = 0;
            $aPassengers = array();
            $aTariffs = array();
            Yii::beginProfile('processingPassengers');
            UtilsHelper::soapObjectsArray($oSoapFlight->PricingInfo->PassengerFare);
            foreach ($oSoapFlight->PricingInfo->PassengerFare as $oFare)
            {
                $sType = $oFare->Type;
                $aPassengers[$sType]['count'] = $oFare->Quantity;
                $aPassengers[$sType]['base_fare'] = $oFare->BaseFare->Amount;
                $aPassengers[$sType]['total_fare'] = $oFare->TotalFare->Amount;
                $full_sum += ($oFare->TotalFare->Amount * $oFare->Quantity);
                $aPassengers[$sType]['LastTicketDateTime'] = $oFare->LastTicketDateTime;
                $aPassengers[$sType]['aTaxes'] = array();
                UtilsHelper::soapObjectsArray($oFare->Taxes->Tax);
                foreach ($oFare->Taxes->Tax as $oTax)
                {
                    if ($oTax->CurCode == 'RUB')
                    {
                        $aPassengers[$sType]['aTaxes'][$oTax->TaxCode] = $oTax->Amount;
                    } else
                    {
                        throw new CException(Yii::t('application', 'Valute code unexpected. Code: {code}. Expected RUB', array(
                            '{code}' => $oTax->CurCode
                        )));
                    }
                }
                UtilsHelper::soapObjectsArray($oFare->Tariffs->Tariff);
                foreach ($oFare->Tariffs->Tariff as $oTariff)
                {
                    $aParts[$oTariff->SegNum]->aTariffs[$oTariff->Code] = $oTariff->Code;
                }
            }
            Yii::endProfile('processingPassengers');
            $aNewParts = array();
            //print_r($aParts);
            $oPart = reset($aParts);
            foreach ($flightSearchParams->routes as $route)
            {
                $aSubParts = array();
                $aCities = array();
                while ($oPart)
                {
                    $aSubParts[] = $oPart;
                    $aCities[] = $oPart->arrival_city->code;
                    if ($route->arrival_city->code === $oPart->arrival_city->code)
                    {
                        $oPart = next($aParts);
                        break;
                    }
                    $oPart = next($aParts);
                }
                if (!$oPart)
                {
                    $oPart = end($aParts);

                    if ($route->arrival_city->code !== $oPart->arrival_city->code)
                    {
                        throw new CException(Yii::t('application', 'Not found segment with code arrival city {code}. Segment cityes: {codes}', array(
                            '{code}' => $route->arrival_city->code,
                            '{codes}' => implode(', ', $aCities)
                        )));
                    }
                }
                $aNewParts[] = $aSubParts;
            }

            $oFlight = new stdClass();
            $oFlight->full_sum = $full_sum;
            $oFlight->commission_price = 0;
            $oFlight->flight_key = $oSoapFlight->FlightId;
            $oFlight->parts = $aNewParts;
            $flights[] = $oFlight;
        }
        Yii::endProfile('processingSoap');
        //print_r($aFlights);


        return $flights;

    }

    public function FlightBooking(FlightBookingParams $oFlightBookingParams)
    {
        if (!($oFlightBookingParams instanceof FlightBookingParams))
        {
            throw new CException(Yii::t('application', 'Parameter oFlightBookingParams not type of FlightBookingParams'));
        }
        $aParams = array(
            'Request' => array(
                'BookFlight' => array(
                    'FlightId' => 534733,
                    'BookingCodes' => array(
                        'BookingCode' => array(
                            'Code' => 'Q',
                            'SegNumber' => '1'
                        )
                    ),
                    'Agency' => array(
                        'Name' => 'Easy',
                        'Address' => array(
                            'City' => 'Saint-Petersburg'
                        )
                    ),
                    'Travellers' => array(
                        'Traveller' => array(
                            array(
                                'Type' => 'ADT',
                                'Num' => '1',
                                'PersonalInfo' => array(
                                    'DateOfBirth' => '01.01.1985',
                                    'Nationality' => 'RU',
                                    'Gender' => 'M',
                                    'FirstName' => 'Aleksandr',
                                    'LastName' => 'Kovalev'
                                ),
                                'DocumentInfo' => array(
                                    'DocType' => 'М',
                                    'DocNum' => 'asdawe131',
                                    'CountryCode' => 'RU',
                                    'DocElapsedTime' => '24.03.2026'
                                )
                            ),
                            array(
                                'Type' => 'ADT',
                                'Count' => '1'
                            )
                        )
                    )
                ),
                'Source' => array(
                    'ClientId' => 102,
                    'APIKey' => '7F48365D42B73307C99C12A578E92B36',
                    'Language' => 'UA',
                    'Currency' => 'RUB'
                )
            )
        );
        if ($oFlightBookingParams->checkValid())
        {
            $aTraveler = array();
            $iNum = 1;
            foreach ($oFlightBookingParams->passengers as $passenger)
            {
                $oTraveller = array();
                $oTraveller['Type'] = Yii::app()->params['aPassegerTypes'][$passenger->iType];
                $oTraveller['Num'] = $iNum;
                $oTraveller['PersonalInfo'] = array();
                $oTraveller['PersonalInfo']['DateOfBirth'] = UtilsHelper::dateToPointDate($passenger->oPassport->birthday);
                $oTraveller['PersonalInfo']['Nationality'] = Country::model()->findByPk($passenger->oPassport->country_id)->code;
                $oTraveller['PersonalInfo']['Gender'] = $passenger->oPassport->gender_id == 1 ? 'M' : 'F';
                $oTraveller['PersonalInfo']['FirstName'] = $passenger->oPassport->first_name;
                $oTraveller['PersonalInfo']['LastName'] = $passenger->oPassport->last_name;
                $oTraveller['DocumentInfo'] = array();
                $oTraveller['DocumentInfo']['DocType'] = $passenger->oPassport->document_type_id;
                $oTraveller['DocumentInfo']['DocNum'] = $passenger->oPassport->number;
                $oTraveller['DocumentInfo']['CountryCode'] = Country::model()->findByPk($passenger->oPassport->country_id)->code;
                $oTraveller['DocumentInfo']['DocElapsedTime'] = UtilsHelper::dateToPointDate($passenger->oPassport->expiration);
            }
        } else
        {
            throw new CException(Yii::t('application', 'Data in parameter oFlightBookingParams not valid'));
        }
        print_r(self::request('bookFlight', $aParams, $bCache = FALSE, $iExpiration = 0));
    }

    public function FlightTariffRules()
    {
        $aParams = array(
            'Request' => array(
                'GetAirRules' => array(
                    'FlightId' => 534733
                ),
                'Source' => array(
                    'ClientId' => 102,
                    'APIKey' => '7F48365D42B73307C99C12A578E92B36',
                    'Language' => 'UA',
                    'Currency' => 'RUB'
                )
            )
        );

        print_r(self::request('GetAirRules', $aParams, $bCache = FALSE, $iExpiration = 0));
    }

    public function checkFlight()
    {
        $aParams = array(
            'Request' => array(
                'AirAvail' => array(
                    'FlightId' => 534733
                ),
                'Source' => array(
                    'ClientId' => 102,
                    'APIKey' => '7F48365D42B73307C99C12A578E92B36',
                    'Language' => 'UA',
                    'Currency' => 'RUB'
                )
            )
        );

        print_r(self::request('AirAvail', $aParams, $bCache = FALSE, $iExpiration = 0));
    }

    public function FlightTicketing()
    {
        $aParams = array(
            'Request' => array(
                'Ticketing' => array(
                    'BookID' => 534733,
                    'ValCompany' => '',
                    'Commision' => array(
                        'Percent' => '2'
                    )
                ),
                'Source' => array(
                    'ClientId' => 102,
                    'APIKey' => '7F48365D42B73307C99C12A578E92B36',
                    'Language' => 'UA',
                    'Currency' => 'RUB'
                )
            )
        );

        print_r(self::request('bookFlight', $aParams, $bCache = FALSE, $iExpiration = 0));

    }

    public function FlightVoid()
    {
        $aParams = array(
            'Request' => array(
                'VoidTicket' => array(
                    'BookID' => 534733
                ),
                'Source' => array(
                    'ClientId' => 102,
                    'APIKey' => '7F48365D42B73307C99C12A578E92B36',
                    'Language' => 'UA',
                    'Currency' => 'RUB'
                )
            )
        );

        print_r(self::request('bookFlight', $aParams, $bCache = FALSE, $iExpiration = 0));
    }
}

