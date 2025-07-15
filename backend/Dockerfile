###################################################
# Stage: backend-base
#
###################################################
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-base
WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
COPY . ./
RUN dotnet publish -c Release -o out

###################################################
# Stage: backend-dev
#
# This stage is for development
###################################################
FROM backend-base AS backend-dev
CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:5152"]

###################################################
# Stage: backend-production
#
# This stage is for production
###################################################
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS backend-production
WORKDIR /app
COPY --from=backend-base /app/out ./
EXPOSE 5152
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "backend.dll"]