<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 29.05.12
 * Time: 10:21
 */
class PopularityOfDepartureCitySearch extends Report
{
    private $result;

    public function __construct()
    {
        $this->result = new PopularityOfDepartureCitySearchResult;
    }

    public function getMongoCommand()
    {
        $commands = array();
        $map = new MongoCode("
            function() {
                var date = ISODate(this.dateCreate);
                var key = {departureCityId: this.departureCityId, arrivalCityId: this.arrivalCityId };
                emit(key, {count: 1});
            };
        ");
        $reduce = new MongoCode("function(key, values) {
                var sum = 0;
                values.forEach(function(value) {
                    sum += value['count'];
                });
                return {count: sum};
            };
        ");
        $commands['mapreduce1'] = array(
            "mapreduce" => Statistic::model()->getCollectionName(),
            "map" => $map,
            "reduce" => $reduce,
            "query" => array("modelName" => "FlightSearch"),
            "out" =>$this->result->getCollectionName()
        );
        return $commands;
    }

    public function getResult()
    {
        return $this->result;
    }
}

class PopularityOfDepartureCitySearchResult extends ReportResult
{
    private $departureCity;
    private $arrivalCity;


    public function getDepartureCity()
    {
        if ($this->departureCity==null)
            $this->departureCity = City::model()->findByPk($this->_id['departureCityId']);
        return $this->departureCity;
    }

    public function getArrivalCity()
    {
        if ($this->arrivalCity==null)
            $this->arrivalCity = City::model()->findByPk($this->_id['arrivalCityId']);
        return $this->arrivalCity;
    }

    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }

    public function getReportName()
    {
        return 'popularity_of_flight_search';
    }

    public function search($caseSensitive = false, $config=array())
    {
        return parent::search($caseSensitive, array(
            'keyField' => 'primaryKey',
            'sort'=>array(
                'defaultOrder'=>'value.count desc',
                'attributes'=>array(
                    'count' => array('asc'=>'value.count asc', 'desc'=>'value.count desc')
        ))));
    }
}
