class StationsController < ApplicationController
  def index
    @stations = Station.all
    render json: @stations
  end

  def show
    @station = Station.find(params[:id])
    render json: @station
  end
end
