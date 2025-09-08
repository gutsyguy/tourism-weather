class ApplicationController < ActionController::API
  # Respond to OPTIONS requests for preflight
  before_action :handle_options_request

  private

  def handle_options_request
    if request.method == "OPTIONS"
      headers["Access-Control-Allow-Origin"] = "*"
      headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD"
      headers["Access-Control-Allow-Headers"] = "Origin, Content-Type, Accept, Authorization, Token"
      render plain: "", content_type: "text/plain"
    end
  end
end
