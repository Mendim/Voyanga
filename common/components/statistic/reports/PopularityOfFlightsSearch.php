<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 29.05.12
 * Time: 10:21
 */
class PopularityOfFlightsSearch extends Report
{
    private $result;

    public function __construct()
    {
        $this->result = new PopularityOfFlightsSearchResult;
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
        $finalize = new MongoCode("function (key, value) {
            return value['count']
        }");
        $commands['mapreduce1'] = array(
            "mapreduce" => Statistic::model()->getCollectionName(),
            "map" => $map,
            "reduce" => $reduce,
            "finalize" => $finalize,
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

class PopularityOfFlightsSearchResult extends ReportResult
{
    private $departureCity;
    private $arrivalCity;

    public function getDepartureCity()
    {
        if ($this->departureCity==null)
            $this->departureCity = City::getCityByPk($this->_id['departureCityId']);
        return $this->departureCity;
    }

    public function getArrivalCity()
    {
        if ($this->arrivalCity==null)
            $this->arrivalCity = City::getCityByPk($this->_id['arrivalCityId']);
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
                'defaultOrder'=>'value desc',
                'attributes'=>array(
                    'value' => array('asc'=>'value asc', 'desc'=>'value desc')
        ))));
    }
}
