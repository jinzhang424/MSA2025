###################################################
# Stage: backend-dev
#
# This stage is for development
###################################################
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-dev
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy source code and public
COPY . ./
RUN dotnet public -c Release -o out
CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:5000"]

###################################################
# Stage: backend-build
#
# This stage is for production
###################################################
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS backend-build
WORKDIR /app
COPY --from=backend-base /app/out ./
EXPOSE 5000
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "backend.dll"]